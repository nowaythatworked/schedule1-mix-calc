/**
 * Multi-Product Optimization engine for Schedule 1 calculator
 * Finds optimal substance sequences that maximize combined profit across multiple products
 */

import type {
  MultiProductOptimizationOptions,
  MultiProductOptimizationResult,
  ProductMixResult,
  MixState,
  SubstanceName,
  ProductName,
  EffectName,
} from "../types/index.js";
import { Mixer } from "../engine/mixer.js";
import { getAllSubstances, getSubstance } from "../data/substances.js";
import { getHighestValueEffects, getEffect } from "../data/effects.js";
import { getProduct } from "../data/products.js";

interface MultiProductCacheEntry {
  result: MultiProductOptimizationResult;
  stepsUsed: number;
}

export class MultiProductOptimizer {
  private mixer: Mixer;
  private cache: Map<string, MultiProductCacheEntry>;
  private globalBest: MultiProductOptimizationResult | null;

  constructor() {
    this.mixer = new Mixer();
    this.cache = new Map();
    this.globalBest = null;
  }

  /**
   * Finds the optimal mix sequence for multiple products
   */
  findOptimalMix(
    options: MultiProductOptimizationOptions
  ): MultiProductOptimizationResult {
    this.cache.clear();
    this.globalBest = null;

    if (options.baseProducts.length === 0) {
      throw new Error("At least one base product must be specified");
    }

    const availableSubstances =
      options.availableSubstances || getAllSubstances();

    // Create initial states for all products
    const initialStates = new Map<ProductName, MixState>();
    for (const product of options.baseProducts) {
      initialStates.set(product, this.mixer.createInitialState(product));
    }

    // Handle zero steps case
    if (options.maxSteps === 0) {
      return this.createResult(initialStates, []);
    }

    const result = this.search(
      initialStates,
      options.maxSteps,
      availableSubstances,
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
    currentStates: Map<ProductName, MixState>,
    stepsRemaining: number,
    availableSubstances: SubstanceName[],
    budgetLimit?: number,
    minAddictionLevel?: number,
    currentSequence: SubstanceName[] = []
  ): MultiProductOptimizationResult | null {
    // Generate state key for memoization (combine all product states)
    const stateKey = this.getMultiProductStateKey(currentStates);

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
      availableSubstances
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

    let bestResult: MultiProductOptimizationResult | null = null;

    // Try each available substance
    for (const substance of availableSubstances) {
      // Budget constraint check (shared across all products)
      const substanceCost = this.getSubstanceCost(substance);
      const currentTotalCost = this.getTotalCost(currentStates);

      if (budgetLimit && currentTotalCost + substanceCost > budgetLimit) {
        continue;
      }

      try {
        // Apply substance to all products
        const newStates = new Map<ProductName, MixState>();
        let validApplication = true;

        for (const [productName, state] of currentStates) {
          try {
            const newState = this.mixer.applySubstance(state, substance);
            newStates.set(productName, newState);
          } catch (error) {
            validApplication = false;
            break;
          }
        }

        if (!validApplication) {
          continue;
        }

        const newSequence = [...currentSequence, substance];

        const result = this.search(
          newStates,
          stepsRemaining - 1,
          availableSubstances,
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
    states: Map<ProductName, MixState>,
    stepsRemaining: number,
    availableSubstances: SubstanceName[]
  ): number {
    if (stepsRemaining === 0) {
      return this.calculateCombinedProfit(states);
    }

    let totalOptimisticProfit = 0;

    // For each product, estimate optimistic profit improvement
    for (const [productName, state] of states) {
      const highestEffects = getHighestValueEffects(stepsRemaining);
      let optimisticMultiplier = 0;

      highestEffects.forEach((effect) => {
        if (!state.effects.has(effect.name)) {
          optimisticMultiplier += effect.multiplier;
        }
      });

      const basePrice = this.getBasePrice(productName);
      const currentMultiplier = this.getCurrentMultiplier(state);
      const optimisticValue =
        basePrice * (1 + currentMultiplier + optimisticMultiplier);

      totalOptimisticProfit += optimisticValue - state.totalCost;
    }

    // Subtract estimated additional costs (shared across products)
    const cheapestCosts = availableSubstances
      .map((name) => this.getSubstanceCost(name))
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
    states: Map<ProductName, MixState>,
    sequence: SubstanceName[]
  ): MultiProductOptimizationResult {
    const productResults: ProductMixResult[] = [];
    let totalSellPrice = 0;
    let totalProfit = 0;
    const totalCost = sequence.length > 0 ? this.getTotalCost(states) : 0;

    for (const [productName, state] of states) {
      const profit = this.mixer.calculateProfit(state);
      const profitMargin =
        state.currentValue > 0 ? (profit / state.currentValue) * 100 : 0;

      const productResult: ProductMixResult = {
        product: productName,
        mixState: state,
        finalEffects: this.mixer.getEffectsArray(state),
        sellPrice: state.currentValue,
        profit,
        profitMargin,
        totalAddiction: state.totalAddiction,
      };

      productResults.push(productResult);
      totalSellPrice += state.currentValue;
      totalProfit += profit;
    }

    // Adjust total profit to account for shared costs
    const adjustedTotalProfit = totalSellPrice - totalCost;
    const averageProfitMargin =
      totalSellPrice > 0 ? (adjustedTotalProfit / totalSellPrice) * 100 : 0;

    return {
      sequence,
      productResults,
      totalCost,
      totalSellPrice,
      totalProfit: adjustedTotalProfit,
      averageProfitMargin,
    };
  }

  /**
   * Helper methods
   */
  private calculateCombinedProfit(states: Map<ProductName, MixState>): number {
    let totalSellPrice = 0;
    let totalCost = 0;

    for (const state of states.values()) {
      totalSellPrice += state.currentValue;
      totalCost = state.totalCost; // All states have the same total cost (shared)
    }

    return totalSellPrice - totalCost;
  }

  private getTotalCost(states: Map<ProductName, MixState>): number {
    // All products share the same cost since they use the same sequence
    const firstState = states.values().next().value;
    return firstState ? firstState.totalCost : 0;
  }

  private getMultiProductStateKey(states: Map<ProductName, MixState>): string {
    const stateKeys: string[] = [];

    for (const [productName, state] of states) {
      const effectsKey = Array.from(state.effects).sort().join(",");
      stateKeys.push(`${productName}:${effectsKey}`);
    }

    return stateKeys.sort().join("|");
  }

  private updateGlobalBest(result: MultiProductOptimizationResult): void {
    if (!this.globalBest || result.totalProfit > this.globalBest.totalProfit) {
      this.globalBest = result;
    }
  }

  private getSubstanceCost(substanceName: SubstanceName): number {
    const substance = getSubstance(substanceName);
    return substance?.cost ?? 0;
  }

  private getBasePrice(productName: ProductName): number {
    const product = getProduct(productName);
    return product?.basePrice ?? 35;
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
