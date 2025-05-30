/**
 * Core type definitions for Schedule 1 calculator
 */

export type EffectName = 
  | 'Anti-Gravity' | 'Athletic' | 'Balding' | 'Bright-Eyed' | 'Calming'
  | 'Calorie-Dense' | 'Cyclopean' | 'Disorienting' | 'Electrifying' | 'Energizing'
  | 'Euphoric' | 'Explosive' | 'Focused' | 'Foggy' | 'Gingeritis'
  | 'Glowing' | 'Jennerising' | 'Laxative' | 'Long Faced' | 'Munchies'
  | 'Paranoia' | 'Refreshing' | 'Schizophrenia' | 'Sedating' | 'Seizure-Inducing'
  | 'Shrinking' | 'Slippery' | 'Smelly' | 'Sneaky' | 'Spicy'
  | 'Thought-Provoking' | 'Toxic' | 'Tropic Thunder' | 'Zombifying';

export type ProductName = 
  | 'OG Kush' | 'Sour Diesel' | 'Green Crack' | 'Grandaddy Purple'
  | 'Meth' | 'Cocaine';

export type SubstanceName = 
  | 'Cuke' | 'Flu Medicine' | 'Gasoline' | 'Donut' | 'Energy Drink'
  | 'Mouth Wash' | 'Motor Oil' | 'Banana' | 'Chili' | 'Iodine'
  | 'Paracetamol' | 'Viagra' | 'Horse Semen' | 'Mega Bean' | 'Addy' | 'Battery';

export interface Effect {
  name: EffectName;
  multiplier: number;
  addiction?: number;
}

export interface Product {
  name: ProductName;
  basePrice: number;
  initialEffects: EffectName[];
  category: 'weed' | 'stimulant';
}

export interface TransformationRule {
  condition: EffectName;
  replacement: EffectName;
}

export interface Substance {
  name: SubstanceName;
  cost: number;
  defaultEffect: EffectName;
  transformationRules: TransformationRule[];
}

export interface MixState {
  baseProduct: ProductName;
  effects: Set<EffectName>;
  substancesUsed: SubstanceName[];
  totalCost: number;
  currentValue: number;
  profit: number;
}

export interface OptimizationResult {
  mixState: MixState;
  sequence: SubstanceName[];
  finalEffects: EffectName[];
  totalCost: number;
  sellPrice: number;
  profit: number;
  profitMargin: number;
}

export interface OptimizationOptions {
  baseProduct: ProductName;
  maxSteps: number;
  availableSubstances?: SubstanceName[];
  targetEffects?: EffectName[];
  budgetLimit?: number;
}
