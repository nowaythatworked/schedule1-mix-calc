/**
 * Core mixing engine for Schedule 1 calculator
 * Handles substance application, effect transformations, and state management
 */

import type {
  MixState,
  SubstanceName,
  IngredientName,
  EffectName,
} from "../types/index.js";
import { getSubstance } from "../data/substances.js";
import { getIngredient } from "../data/ingredients.js";
import { getEffect } from "../data/effects.js";

export class Mixer {
  private static readonly MAX_EFFECTS = 8;

  /**
   * Creates initial mix state from a base substance
   */
  createInitialState(substanceName: SubstanceName): MixState {
    const substance = getSubstance(substanceName);
    if (!substance) {
      throw new Error(`Substance not found: ${substanceName}`);
    }

    const effects = new Set(substance.initialEffects);
    const currentValue = this.calculateValueFromEffects(
      substance.basePrice,
      effects
    );
    const totalAddiction = this.calculateTotalAddiction(effects);

    return {
      baseSubstance: substanceName,
      effects,
      ingredientsUsed: [],
      totalCost: 0,
      currentValue,
      profit: currentValue,
      totalAddiction,
    };
  }

  /**
   * Applies an ingredient to the current mix state
   */
  applyIngredient(
    currentState: MixState,
    ingredientName: IngredientName
  ): MixState {
    const ingredient = getIngredient(ingredientName);
    if (!ingredient) {
      throw new Error(`Ingredient not found: ${ingredientName}`);
    }

    // Create new effects set from current state
    const newEffects = new Set(currentState.effects);

    // Apply transformation rules
    ingredient.transformationRules.forEach((rule) => {
      if (newEffects.has(rule.condition)) {
        newEffects.delete(rule.condition);
        newEffects.add(rule.replacement);
      }
    });

    // Add default effect if there's space and it's not already present
    if (
      newEffects.size < Mixer.MAX_EFFECTS &&
      !newEffects.has(ingredient.defaultEffect)
    ) {
      newEffects.add(ingredient.defaultEffect);
    }

    const newTotalCost = currentState.totalCost + ingredient.cost;
    const newTotalAddiction = this.calculateTotalAddiction(newEffects);
    const newCurrentValue = this.calculateCurrentValue({
      ...currentState,
      effects: newEffects,
      totalCost: newTotalCost,
      totalAddiction: newTotalAddiction,
    });

    return {
      baseSubstance: currentState.baseSubstance,
      effects: newEffects,
      ingredientsUsed: [...currentState.ingredientsUsed, ingredientName],
      totalCost: newTotalCost,
      currentValue: newCurrentValue,
      profit: newCurrentValue - newTotalCost,
      totalAddiction: newTotalAddiction,
    };
  }

  /**
   * Applies a sequence of ingredients to create final mix state
   */
  applySequence(
    substanceName: SubstanceName,
    ingredients: IngredientName[]
  ): MixState {
    let state = this.createInitialState(substanceName);

    ingredients.forEach((ingredient) => {
      state = this.applyIngredient(state, ingredient);
    });

    return state;
  }

  /**
   * Backward compatibility method - applies an ingredient (old "substance")
   */
  applySubstance(
    currentState: MixState,
    ingredientName: IngredientName
  ): MixState {
    return this.applyIngredient(currentState, ingredientName);
  }

  /**
   * Calculates current value of the mix based on effects
   */
  calculateCurrentValue(state: MixState): number {
    const substance = getSubstance(state.baseSubstance);
    if (!substance) {
      throw new Error(`Substance not found: ${state.baseSubstance}`);
    }

    return this.calculateValueFromEffects(substance.basePrice, state.effects);
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
  private calculateValueFromEffects(
    basePrice: number,
    effects: Set<EffectName>
  ): number {
    let totalMultiplier = 0;

    effects.forEach((effectName) => {
      const effect = getEffect(effectName);
      if (effect) {
        totalMultiplier += effect.multiplier;
      }
    });

    // Final Price = Base Price * (1 + total effect multiplier)
    return basePrice * (1 + totalMultiplier);
  }

  /**
   * Calculates total addiction percentage from effects
   */
  calculateTotalAddiction(effects: Set<EffectName>): number {
    let totalAddiction = 0;

    effects.forEach((effectName) => {
      const effect = getEffect(effectName);
      if (effect && effect.addiction) {
        totalAddiction += effect.addiction;
      }
    });

    // Convert to percentage (multiply by 100, round, and cap at 100%)
    return Math.min(100, Math.round(totalAddiction * 100));
  }

  /**
   * Gets all effects from current state as array
   */
  getEffectsArray(state: MixState): EffectName[] {
    return Array.from(state.effects);
  }

  /**
   * Checks if adding an ingredient would exceed effect limit
   */
  wouldExceedEffectLimit(
    state: MixState,
    ingredientName: IngredientName
  ): boolean {
    const ingredient = getIngredient(ingredientName);
    if (!ingredient) return false;

    // Simulate applying the ingredient
    const tempEffects = new Set(state.effects);

    // Apply transformation rules
    ingredient.transformationRules.forEach((rule) => {
      if (tempEffects.has(rule.condition)) {
        tempEffects.delete(rule.condition);
        tempEffects.add(rule.replacement);
      }
    });

    // Check if adding default effect would exceed limit
    return (
      tempEffects.size >= Mixer.MAX_EFFECTS &&
      !tempEffects.has(ingredient.defaultEffect)
    );
  }
}
