/**
 * Optimization engine for Schedule 1 calculator
 * Uses hybrid Dynamic Programming + Branch and Bound approach
 */

import type {
  OptimizationOptions,
  OptimizationResult,
  MixState,
  IngredientName,
  EffectName,
} from "../types/index.js";
import { Mixer } from "../engine/mixer.js";
import { getAllIngredients, getIngredient } from "../data/ingredients.js";
import { getHighestValueEffects, getEffect } from "../data/effects.js";
import { getSubstance } from "../data/substances.js";

interface CacheEntry {
  result: OptimizationResult;
  stepsUsed: number;
}

export class Optimizer {
  private mixer: Mixer;
  private cache: Map<string, CacheEntry>;
  private globalBest: OptimizationResult | null;

  constructor() {
    this.mixer = new Mixer();
    this.cache = new Map();
    this.globalBest = null;
  }

  /**
   * Finds the optimal mix for given options
   */
  findOptimalMix(options: OptimizationOptions): OptimizationResult {
    this.cache.clear();
    this.globalBest = null;

    const availableIngredients =
      options.availableIngredients || getAllIngredients();
    const initialState = this.mixer.createInitialState(options.baseSubstance);

    // Handle zero steps case
    if (options.maxSteps === 0) {
      return this.createResult(initialState, []);
    }

    const result = this.search(
      initialState,
      options.maxSteps,
      availableIngredients,
      options.budgetLimit,
      options.minAddictionLevel,
      []
    );

    return result || this.createResult(initialState, []);
  }

  /**
   * Recursive search with memoization and branch & bound
   */
  private search(
    currentState: MixState,
    stepsRemaining: number,
    availableIngredients: IngredientName[],
    budgetLimit?: number,
    minAddictionLevel?: number,
    currentSequence: IngredientName[] = []
  ): OptimizationResult | null {
    // Generate state key for memoization
    const stateKey = this.getStateKey(currentState.effects);

    // Check cache
    const cached = this.cache.get(stateKey);
    if (cached && cached.stepsUsed <= currentSequence.length) {
      return cached.result;
    }

    // Calculate current profit
    const currentProfit = this.mixer.calculateProfit(currentState);

    // Branch and bound pruning
    const maxPossibleProfit = this.estimateMaxProfit(
      currentState,
      stepsRemaining,
      availableIngredients
    );
    if (this.globalBest && maxPossibleProfit <= this.globalBest.profit) {
      return null; // Prune this branch
    }

    // Base case: no more steps
    if (stepsRemaining === 0) {
      // Check addiction constraint if specified
      if (
        minAddictionLevel &&
        currentState.totalAddiction < minAddictionLevel
      ) {
        return null; // Does not meet minimum addiction requirement
      }

      const result = this.createResult(currentState, currentSequence);
      this.updateGlobalBest(result);
      this.cache.set(stateKey, { result, stepsUsed: currentSequence.length });
      return result;
    }

    let bestResult: OptimizationResult | null = null;

    // Try each available ingredient
    for (const ingredient of availableIngredients) {
      // Budget constraint check
      if (
        budgetLimit &&
        currentState.totalCost + this.getIngredientCost(ingredient) >
          budgetLimit
      ) {
        continue;
      }

      try {
        const newState = this.mixer.applyIngredient(currentState, ingredient);
        const newSequence = [...currentSequence, ingredient];

        const result = this.search(
          newState,
          stepsRemaining - 1,
          availableIngredients,
          budgetLimit,
          minAddictionLevel,
          newSequence
        );

        if (result && (!bestResult || result.profit > bestResult.profit)) {
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
   * Estimates maximum possible profit for branch and bound pruning
   */
  private estimateMaxProfit(
    state: MixState,
    stepsRemaining: number,
    availableIngredients: IngredientName[]
  ): number {
    if (stepsRemaining === 0) {
      return this.mixer.calculateProfit(state);
    }

    // Optimistic estimate: assume we can add highest-value effects
    const highestEffects = getHighestValueEffects(stepsRemaining);
    let optimisticMultiplier = 0;

    highestEffects.forEach((effect) => {
      if (!state.effects.has(effect.name)) {
        optimisticMultiplier += effect.multiplier;
      }
    });

    // Find cheapest ingredients for cost estimation
    const cheapestCosts = availableIngredients
      .map((name) => this.getIngredientCost(name))
      .sort((a, b) => a - b)
      .slice(0, stepsRemaining);

    const minAdditionalCost = cheapestCosts.reduce(
      (sum, cost) => sum + cost,
      0
    );
    const basePrice = this.getBasePrice(state.baseSubstance);
    const currentMultiplier = this.getCurrentMultiplier(state);

    const optimisticValue =
      basePrice * (1 + currentMultiplier + optimisticMultiplier);
    return optimisticValue - (state.totalCost + minAdditionalCost);
  }

  /**
   * Creates optimization result from mix state and sequence
   */
  private createResult(
    state: MixState,
    sequence: IngredientName[]
  ): OptimizationResult {
    const profit = this.mixer.calculateProfit(state);
    const profitMargin =
      state.currentValue > 0 ? (profit / state.currentValue) * 100 : 0;

    return {
      mixState: state,
      sequence,
      finalEffects: this.mixer.getEffectsArray(state),
      totalCost: state.totalCost,
      sellPrice: state.currentValue,
      profit,
      profitMargin,
      totalAddiction: state.totalAddiction,
    };
  }

  /**
   * Updates global best result
   */
  private updateGlobalBest(result: OptimizationResult): void {
    if (!this.globalBest || result.profit > this.globalBest.profit) {
      this.globalBest = result;
    }
  }

  /**
   * Generates cache key from effects set
   */
  private getStateKey(effects: Set<EffectName>): string {
    return Array.from(effects).sort().join("|");
  }

  /**
   * Helper methods for calculations
   */
  private getIngredientCost(ingredientName: IngredientName): number {
    const ingredient = getIngredient(ingredientName);
    return ingredient?.cost ?? 0;
  }

  private getBasePrice(substanceName: string): number {
    const substance = getSubstance(substanceName as any);
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
