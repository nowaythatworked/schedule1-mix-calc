/**
 * Core type definitions for Schedule 1 calculator
 */

export type EffectName =
  | "Anti-Gravity"
  | "Athletic"
  | "Balding"
  | "Bright-Eyed"
  | "Calming"
  | "Calorie-Dense"
  | "Cyclopean"
  | "Disorienting"
  | "Electrifying"
  | "Energizing"
  | "Euphoric"
  | "Explosive"
  | "Focused"
  | "Foggy"
  | "Gingeritis"
  | "Glowing"
  | "Jennerising"
  | "Laxative"
  | "Long Faced"
  | "Munchies"
  | "Paranoia"
  | "Refreshing"
  | "Schizophrenia"
  | "Sedating"
  | "Seizure-Inducing"
  | "Shrinking"
  | "Slippery"
  | "Smelly"
  | "Sneaky"
  | "Spicy"
  | "Thought-Provoking"
  | "Toxic"
  | "Tropic Thunder"
  | "Zombifying";

export type SubstanceName =
  | "OG Kush"
  | "Sour Diesel"
  | "Green Crack"
  | "Grandaddy Purple"
  | "Meth"
  | "Cocaine";

export type IngredientName =
  | "Cuke"
  | "Flu Medicine"
  | "Gasoline"
  | "Donut"
  | "Energy Drink"
  | "Mouth Wash"
  | "Motor Oil"
  | "Banana"
  | "Chili"
  | "Iodine"
  | "Paracetamol"
  | "Viagra"
  | "Horse Semen"
  | "Mega Bean"
  | "Addy"
  | "Battery";

export interface Effect {
  name: EffectName;
  multiplier: number;
  addiction?: number;
}

export interface Substance {
  name: SubstanceName;
  basePrice: number;
  initialEffects: EffectName[];
  category: "weed" | "stimulant";
}

export interface TransformationRule {
  condition: EffectName;
  replacement: EffectName;
}

export interface Ingredient {
  name: IngredientName;
  cost: number;
  defaultEffect: EffectName;
  transformationRules: TransformationRule[];
}

export interface MixState {
  baseSubstance: SubstanceName;
  effects: Set<EffectName>;
  ingredientsUsed: IngredientName[];
  totalCost: number;
  currentValue: number;
  profit: number;
  totalAddiction: number;
}

export interface OptimizationResult {
  mixState: MixState;
  sequence: IngredientName[];
  finalEffects: EffectName[];
  totalCost: number;
  sellPrice: number;
  profit: number;
  profitMargin: number;
  totalAddiction: number;
}

export interface OptimizationOptions {
  baseSubstance: SubstanceName;
  maxSteps: number;
  availableIngredients?: IngredientName[];
  targetEffects?: EffectName[];
  budgetLimit?: number;
  minAddictionLevel?: number;
}

export interface MultiSubstanceOptimizationOptions {
  baseSubstances: SubstanceName[];
  maxSteps: number;
  availableIngredients?: IngredientName[];
  budgetLimit?: number;
  minAddictionLevel?: number;
}

export interface SubstanceMixResult {
  substance: SubstanceName;
  mixState: MixState;
  finalEffects: EffectName[];
  sellPrice: number;
  profit: number;
  profitMargin: number;
  totalAddiction: number;
}

export interface MultiSubstanceOptimizationResult {
  sequence: IngredientName[];
  substanceResults: SubstanceMixResult[];
  totalCost: number;
  totalSellPrice: number;
  totalProfit: number;
  averageProfitMargin: number;
}
