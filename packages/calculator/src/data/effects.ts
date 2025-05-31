/**
 * Effects data for Schedule 1 game
 * Based on the official calculator data from schedule1-calculator.com
 */

import type { Effect, EffectName } from "../types/index.js";

export const EFFECTS: Record<EffectName, Effect> = {
  "Anti-Gravity": { name: "Anti-Gravity", multiplier: 0.54, addiction: 0.611 },
  Athletic: { name: "Athletic", multiplier: 0.32, addiction: 0.607 },
  Balding: { name: "Balding", multiplier: 0.3, addiction: 0 },
  "Bright-Eyed": { name: "Bright-Eyed", multiplier: 0.4, addiction: 0.2 },
  Calming: { name: "Calming", multiplier: 0.1, addiction: 0 },
  "Calorie-Dense": { name: "Calorie-Dense", multiplier: 0.28, addiction: 0.1 },
  Cyclopean: { name: "Cyclopean", multiplier: 0.56, addiction: 0.1 },
  Disorienting: { name: "Disorienting", multiplier: 0.0, addiction: 0 },
  Electrifying: { name: "Electrifying", multiplier: 0.5, addiction: 0.235 },
  Energizing: { name: "Energizing", multiplier: 0.22, addiction: 0.34 },
  Euphoric: { name: "Euphoric", multiplier: 0.18, addiction: 0.235 },
  Explosive: { name: "Explosive", multiplier: 0.0, addiction: 0 },
  Focused: { name: "Focused", multiplier: 0.16, addiction: 0.104 },
  Foggy: { name: "Foggy", multiplier: 0.36, addiction: 0.1 },
  Gingeritis: { name: "Gingeritis", multiplier: 0.2, addiction: 0 },
  Glowing: { name: "Glowing", multiplier: 0.48, addiction: 0.472 },
  Jennerising: { name: "Jennerising", multiplier: 0.42, addiction: 0.343 },
  Laxative: { name: "Laxative", multiplier: 0.0, addiction: 0.1 },
  "Long Faced": { name: "Long Faced", multiplier: 0.52, addiction: 0.607 },
  Munchies: { name: "Munchies", multiplier: 0.12, addiction: 0.096 },
  Paranoia: { name: "Paranoia", multiplier: 0.0, addiction: 0 },
  Refreshing: { name: "Refreshing", multiplier: 0.14, addiction: 0.104 },
  Schizophrenia: { name: "Schizophrenia", multiplier: 0.0, addiction: 0 },
  Sedating: { name: "Sedating", multiplier: 0.26, addiction: 0 },
  "Seizure-Inducing": {
    name: "Seizure-Inducing",
    multiplier: 0.0,
    addiction: 0,
  },
  Shrinking: { name: "Shrinking", multiplier: 0.6, addiction: 0.336 },
  Slippery: { name: "Slippery", multiplier: 0.34, addiction: 0.309 },
  Smelly: { name: "Smelly", multiplier: 0.0, addiction: 0 },
  Sneaky: { name: "Sneaky", multiplier: 0.24, addiction: 0.327 },
  Spicy: { name: "Spicy", multiplier: 0.38, addiction: 0.665 },
  "Thought-Provoking": {
    name: "Thought-Provoking",
    multiplier: 0.44,
    addiction: 0.37,
  },
  Toxic: { name: "Toxic", multiplier: 0.0, addiction: 0 },
  "Tropic Thunder": {
    name: "Tropic Thunder",
    multiplier: 0.46,
    addiction: 0.803,
  },
  Zombifying: { name: "Zombifying", multiplier: 0.58, addiction: 0.598 },
};

export const getEffect = (name: EffectName): Effect | undefined => {
  return EFFECTS[name];
};

export const getAllEffects = (): EffectName[] => {
  return Object.keys(EFFECTS) as EffectName[];
};

export const getEffectsByMultiplierRange = (
  min: number,
  max: number
): Effect[] => {
  return Object.values(EFFECTS).filter(
    (effect) => effect.multiplier >= min && effect.multiplier <= max
  );
};

export const getHighestValueEffects = (count: number = 5): Effect[] => {
  return Object.values(EFFECTS)
    .sort((a, b) => b.multiplier - a.multiplier)
    .slice(0, count);
};
