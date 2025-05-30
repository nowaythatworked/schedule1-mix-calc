/**
 * Effects data for Schedule 1 game
 * Based on the official calculator data from schedule1-calculator.com
 */

import type { Effect, EffectName } from '../types/index.js';

export const EFFECTS: Record<EffectName, Effect> = {
  'Anti-Gravity': { name: 'Anti-Gravity', multiplier: 0.54 },
  'Athletic': { name: 'Athletic', multiplier: 0.32 },
  'Balding': { name: 'Balding', multiplier: 0.30 },
  'Bright-Eyed': { name: 'Bright-Eyed', multiplier: 0.40 },
  'Calming': { name: 'Calming', multiplier: 0.10 },
  'Calorie-Dense': { name: 'Calorie-Dense', multiplier: 0.28 },
  'Cyclopean': { name: 'Cyclopean', multiplier: 0.56 },
  'Disorienting': { name: 'Disorienting', multiplier: 0.00 },
  'Electrifying': { name: 'Electrifying', multiplier: 0.50 },
  'Energizing': { name: 'Energizing', multiplier: 0.22 },
  'Euphoric': { name: 'Euphoric', multiplier: 0.18 },
  'Explosive': { name: 'Explosive', multiplier: 0.00 },
  'Focused': { name: 'Focused', multiplier: 0.16 },
  'Foggy': { name: 'Foggy', multiplier: 0.36 },
  'Gingeritis': { name: 'Gingeritis', multiplier: 0.20 },
  'Glowing': { name: 'Glowing', multiplier: 0.48 },
  'Jennerising': { name: 'Jennerising', multiplier: 0.42 },
  'Laxative': { name: 'Laxative', multiplier: 0.00 },
  'Long Faced': { name: 'Long Faced', multiplier: 0.52 },
  'Munchies': { name: 'Munchies', multiplier: 0.12 },
  'Paranoia': { name: 'Paranoia', multiplier: 0.00 },
  'Refreshing': { name: 'Refreshing', multiplier: 0.14 },
  'Schizophrenia': { name: 'Schizophrenia', multiplier: 0.00 },
  'Sedating': { name: 'Sedating', multiplier: 0.26 },
  'Seizure-Inducing': { name: 'Seizure-Inducing', multiplier: 0.00 },
  'Shrinking': { name: 'Shrinking', multiplier: 0.60 },
  'Slippery': { name: 'Slippery', multiplier: 0.34 },
  'Smelly': { name: 'Smelly', multiplier: 0.00 },
  'Sneaky': { name: 'Sneaky', multiplier: 0.24 },
  'Spicy': { name: 'Spicy', multiplier: 0.38 },
  'Thought-Provoking': { name: 'Thought-Provoking', multiplier: 0.44 },
  'Toxic': { name: 'Toxic', multiplier: 0.00 },
  'Tropic Thunder': { name: 'Tropic Thunder', multiplier: 0.46 },
  'Zombifying': { name: 'Zombifying', multiplier: 0.58 }
};

export const getEffect = (name: EffectName): Effect | undefined => {
  return EFFECTS[name];
};

export const getAllEffects = (): EffectName[] => {
  return Object.keys(EFFECTS) as EffectName[];
};

export const getEffectsByMultiplierRange = (min: number, max: number): Effect[] => {
  return Object.values(EFFECTS).filter(
    effect => effect.multiplier >= min && effect.multiplier <= max
  );
};

export const getHighestValueEffects = (count: number = 5): Effect[] => {
  return Object.values(EFFECTS)
    .sort((a, b) => b.multiplier - a.multiplier)
    .slice(0, count);
};
