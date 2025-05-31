/**
 * Multi-Product Optimization engine for Schedule 1 calculator
 * Finds optimal substance sequences that maximize combined profit across multiple products
 */

import type {
  MultiSubstanceOptimizationOptions,
  MultiSubstanceOptimizationResult,
  SubstanceMixResult,
  MixState,
  IngredientName,
  SubstanceName,
  EffectName,
} from "../types/index.js";
import { Mixer } from "../engine/mixer.js";
import { getAllIngredients, getIngredient } from "../data/ingredients.js";
import { getHighestValueEffects, getEffect } from "../data/effects.js";
import { getSubstance } from "../data/substances.js";

interface MultiSubstanceCacheEntry {
  result: MultiSubstanceOptimizationResult;
  stepsUsed: number;
}

export class MultiProductOptimizer {
  private mixer: Mixer;
  private cache: Map<string, MultiSubstanceCacheEntry>;
  private globalBest: MultiSubstanceOptimizationResult | null;

  constructor() {
    this.mixer = new Mixer();
    this.cache = new Map();
    this.globalBest = null;
  }

  /**
   * Finds the optimal mix sequence for multiple products
   */
  findOptimalMix(
    options: MultiSubstanceOptimizationOptions
  ): MultiSubstanceOptimizationResult {
    this.cache.clear();
    this.globalBest = null;

    if (options.baseSubstances.length === 0) {
      throw new Error("At least one base substance must be specified");
    }

    const availableIngredients =
      options.availableIngredients || getAllIngredients();

    // Create initial states for all substances
    const initialStates = new Map<SubstanceName, MixState>();
    for (const substance of options.baseSubstances) {
      initialStates.set(substance, this.mixer.createInitialState(substance));
    }

    // Handle zero steps case
    if (options.maxSteps === 0) {
      return this.createResult(initialStates, []);
    }

    const result = this.search(
      initialStates,
      options.maxSteps,
      availableIngredients,
      options.budgetLimit,
      options.minAddictionLevel,
      []
    );

    return result || this.createResult(initialStates, []);
  }

  /**
   * Recursive search with memoization and branch & bound for multiple products
   */
  private search(
    currentStates: Map<SubstanceName, MixState>,
    stepsRemaining: number,
    availableIngredients: IngredientName[],
    budgetLimit?: number,
    minAddictionLevel?: number,
    currentSequence: IngredientName[] = []
  ): MultiSubstanceOptimizationResult | null {
    // Generate state key for memoization (combine all substance states)
    const stateKey = this.getMultiSubstanceStateKey(currentStates);

    // Check cache
    const cached = this.cache.get(stateKey);
    if (cached && cached.stepsUsed <= currentSequence.length) {
      return cached.result;
    }

    // Calculate current combined profit
    const currentCombinedProfit = this.calculateCombinedProfit(currentStates);

    // Branch and bound pruning
    const maxPossibleProfit = this.estimateMaxCombinedProfit(
      currentStates,
      stepsRemaining,
      availableIngredients
    );
    if (this.globalBest && maxPossibleProfit <= this.globalBest.totalProfit) {
      return null; // Prune this branch
    }

    // Base case: no more steps
    if (stepsRemaining === 0) {
      // Check addiction constraint if specified - all products must meet minimum
      if (minAddictionLevel) {
        for (const state of currentStates.values()) {
          if (state.totalAddiction < minAddictionLevel) {
            return null; // At least one product does not meet minimum addiction requirement
          }
        }
      }

      const result = this.createResult(currentStates, currentSequence);
      this.updateGlobalBest(result);
      this.cache.set(stateKey, { result, stepsUsed: currentSequence.length });
      return result;
    }

    let bestResult: MultiSubstanceOptimizationResult | null = null;

    // Try each available ingredient
    for (const ingredient of availableIngredients) {
      // Budget constraint check (shared across all substances)
      const ingredientCost = this.getIngredientCost(ingredient);
      const currentTotalCost = this.getTotalCost(currentStates);

      if (budgetLimit && currentTotalCost + ingredientCost > budgetLimit) {
        continue;
      }

      try {
        // Apply ingredient to all substances
        const newStates = new Map<SubstanceName, MixState>();
        let validApplication = true;

        for (const [substanceName, state] of currentStates) {
          try {
            const newState = this.mixer.applyIngredient(state, ingredient);
            newStates.set(substanceName, newState);
          } catch (error) {
            validApplication = false;
            break;
          }
        }

        if (!validApplication) {
          continue;
        }

        const newSequence = [...currentSequence, ingredient];

        const result = this.search(
          newStates,
          stepsRemaining - 1,
          availableIngredients,
          budgetLimit,
          minAddictionLevel,
          newSequence
        );

        if (
          result &&
          (!bestResult || result.totalProfit > bestResult.totalProfit)
        ) {
          bestResult = result;
        }
      } catch (error) {
        // Skip invalid substances
        continue;
      }
    }

    // Cache the best result
    if (bestResult) {
      this.cache.set(stateKey, {
        result: bestResult,
        stepsUsed: currentSequence.length,
      });
      this.updateGlobalBest(bestResult);
    }

    return bestResult;
  }

  /**
   * Estimates maximum possible combined profit for branch and bound pruning
   */
  private estimateMaxCombinedProfit(
    states: Map<SubstanceName, MixState>,
    stepsRemaining: number,
    availableIngredients: IngredientName[]
  ): number {
    if (stepsRemaining === 0) {
      return this.calculateCombinedProfit(states);
    }

    let totalOptimisticProfit = 0;

    // For each substance, estimate optimistic profit improvement
    for (const [substanceName, state] of states) {
      const highestEffects = getHighestValueEffects(stepsRemaining);
      let optimisticMultiplier = 0;

      highestEffects.forEach((effect) => {
        if (!state.effects.has(effect.name)) {
          optimisticMultiplier += effect.multiplier;
        }
      });

      const basePrice = this.getBasePrice(substanceName);
      const currentMultiplier = this.getCurrentMultiplier(state);
      const optimisticValue =
        basePrice * (1 + currentMultiplier + optimisticMultiplier);

      totalOptimisticProfit += optimisticValue - state.totalCost;
    }

    // Subtract estimated additional costs (shared across substances)
    const cheapestCosts = availableIngredients
      .map((name) => this.getIngredientCost(name))
      .sort((a, b) => a - b)
      .slice(0, stepsRemaining);

    const minAdditionalCost = cheapestCosts.reduce(
      (sum, cost) => sum + cost,
      0
    );

    return totalOptimisticProfit - minAdditionalCost;
  }

  /**
   * Creates multi-product optimization result
   */
  private createResult(
    states: Map<SubstanceName, MixState>,
    sequence: IngredientName[]
  ): MultiSubstanceOptimizationResult {
    const substanceResults: SubstanceMixResult[] = [];
    let totalSellPrice = 0;
    let totalProfit = 0;
    const totalCost = sequence.length > 0 ? this.getTotalCost(states) : 0;

    for (const [substanceName, state] of states) {
      const profit = this.mixer.calculateProfit(state);
      const profitMargin =
        state.currentValue > 0 ? (profit / state.currentValue) * 100 : 0;

      const substanceResult: SubstanceMixResult = {
        substance: substanceName,
        mixState: state,
        finalEffects: this.mixer.getEffectsArray(state),
        sellPrice: state.currentValue,
        profit,
        profitMargin,
        totalAddiction: state.totalAddiction,
      };

      substanceResults.push(substanceResult);
      totalSellPrice += state.currentValue;
      totalProfit += profit;
    }

    // Adjust total profit to account for shared costs
    const adjustedTotalProfit = totalSellPrice - totalCost;
    const averageProfitMargin =
      totalSellPrice > 0 ? (adjustedTotalProfit / totalSellPrice) * 100 : 0;

    return {
      sequence,
      substanceResults,
      totalCost,
      totalSellPrice,
      totalProfit: adjustedTotalProfit,
      averageProfitMargin,
    };
  }

  /**
   * Helper methods
   */
  private calculateCombinedProfit(
    states: Map<SubstanceName, MixState>
  ): number {
    let totalSellPrice = 0;
    let totalCost = 0;

    for (const state of states.values()) {
      totalSellPrice += state.currentValue;
      totalCost = state.totalCost; // All states have the same total cost (shared)
    }

    return totalSellPrice - totalCost;
  }

  private getTotalCost(states: Map<SubstanceName, MixState>): number {
    // All substances share the same cost since they use the same sequence
    const firstState = states.values().next().value;
    return firstState ? firstState.totalCost : 0;
  }

  private getMultiSubstanceStateKey(
    states: Map<SubstanceName, MixState>
  ): string {
    const stateKeys: string[] = [];

    for (const [substanceName, state] of states) {
      const effectsKey = Array.from(state.effects).sort().join(",");
      stateKeys.push(`${substanceName}:${effectsKey}`);
    }

    return stateKeys.sort().join("|");
  }

  private updateGlobalBest(result: MultiSubstanceOptimizationResult): void {
    if (!this.globalBest || result.totalProfit > this.globalBest.totalProfit) {
      this.globalBest = result;
    }
  }

  private getIngredientCost(ingredientName: IngredientName): number {
    const ingredient = getIngredient(ingredientName);
    return ingredient?.cost ?? 0;
  }

  private getBasePrice(substanceName: SubstanceName): number {
    const substance = getSubstance(substanceName);
    return substance?.basePrice ?? 35;
  }

  private getCurrentMultiplier(state: MixState): number {
    let total = 0;
    state.effects.forEach((effectName) => {
      const effect = getEffect(effectName);
      if (effect) {
        total += effect.multiplier;
      }
    });
    return total;
  }
}
