/**
 * Core mixing engine for Schedule 1 calculator
 * Handles substance application, effect transformations, and state management
 */

import type { MixState, ProductName, SubstanceName, EffectName } from '../types/index.js';
import { getProduct } from '../data/products.js';
import { getSubstance } from '../data/substances.js';
import { getEffect } from '../data/effects.js';

export class Mixer {
  private static readonly MAX_EFFECTS = 8;

  /**
   * Creates initial mix state from a base product
   */
  createInitialState(productName: ProductName): MixState {
    const product = getProduct(productName);
    if (!product) {
      throw new Error(`Product not found: ${productName}`);
    }

    const effects = new Set(product.initialEffects);
    const currentValue = this.calculateValueFromEffects(product.basePrice, effects);

    return {
      baseProduct: productName,
      effects,
      substancesUsed: [],
      totalCost: 0,
      currentValue,
      profit: currentValue
    };
  }

  /**
   * Applies a substance to the current mix state
   */
  applySubstance(currentState: MixState, substanceName: SubstanceName): MixState {
    const substance = getSubstance(substanceName);
    if (!substance) {
      throw new Error(`Substance not found: ${substanceName}`);
    }

    // Create new effects set from current state
    const newEffects = new Set(currentState.effects);

    // Apply transformation rules
    substance.transformationRules.forEach(rule => {
      if (newEffects.has(rule.condition)) {
        newEffects.delete(rule.condition);
        newEffects.add(rule.replacement);
      }
    });

    // Add default effect if there's space and it's not already present
    if (newEffects.size < Mixer.MAX_EFFECTS && !newEffects.has(substance.defaultEffect)) {
      newEffects.add(substance.defaultEffect);
    }

    const newTotalCost = currentState.totalCost + substance.cost;
    const newCurrentValue = this.calculateCurrentValue({
      ...currentState,
      effects: newEffects,
      totalCost: newTotalCost
    });

    return {
      baseProduct: currentState.baseProduct,
      effects: newEffects,
      substancesUsed: [...currentState.substancesUsed, substanceName],
      totalCost: newTotalCost,
      currentValue: newCurrentValue,
      profit: newCurrentValue - newTotalCost
    };
  }

  /**
   * Applies a sequence of substances to create final mix state
   */
  applySequence(productName: ProductName, substances: SubstanceName[]): MixState {
    let state = this.createInitialState(productName);
    
    substances.forEach(substance => {
      state = this.applySubstance(state, substance);
    });

    return state;
  }

  /**
   * Calculates current value of the mix based on effects
   */
  calculateCurrentValue(state: MixState): number {
    const product = getProduct(state.baseProduct);
    if (!product) {
      throw new Error(`Product not found: ${state.baseProduct}`);
    }

    return this.calculateValueFromEffects(product.basePrice, state.effects);
  }

  /**
   * Calculates profit (current value - total cost)
   */
  calculateProfit(state: MixState): number {
    return state.currentValue - state.totalCost;
  }

  /**
   * Helper method to calculate value from base price and effects
   */
  private calculateValueFromEffects(basePrice: number, effects: Set<EffectName>): number {
    let totalMultiplier = 0;

    effects.forEach(effectName => {
      const effect = getEffect(effectName);
      if (effect) {
        totalMultiplier += effect.multiplier;
      }
    });

    // Final Price = Base Price * (1 + total effect multiplier)
    return basePrice * (1 + totalMultiplier);
  }

  /**
   * Gets all effects from current state as array
   */
  getEffectsArray(state: MixState): EffectName[] {
    return Array.from(state.effects);
  }

  /**
   * Checks if adding a substance would exceed effect limit
   */
  wouldExceedEffectLimit(state: MixState, substanceName: SubstanceName): boolean {
    const substance = getSubstance(substanceName);
    if (!substance) return false;

    // Simulate applying the substance
    const tempEffects = new Set(state.effects);
    
    // Apply transformation rules
    substance.transformationRules.forEach(rule => {
      if (tempEffects.has(rule.condition)) {
        tempEffects.delete(rule.condition);
        tempEffects.add(rule.replacement);
      }
    });

    // Check if adding default effect would exceed limit
    return tempEffects.size >= Mixer.MAX_EFFECTS && !tempEffects.has(substance.defaultEffect);
  }
}
