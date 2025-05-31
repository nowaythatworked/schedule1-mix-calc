/**
 * Substances data for Schedule 1 game
 * Based on the official calculator data from schedule1-calculator.com
 */

import type { Substance, SubstanceName } from "../types/index.js";

export const SUBSTANCES: Record<SubstanceName, Substance> = {
  "OG Kush": {
    name: "OG Kush",
    basePrice: 35,
    initialEffects: ["Calming"],
    category: "weed",
  },
  "Sour Diesel": {
    name: "Sour Diesel",
    basePrice: 35,
    initialEffects: ["Refreshing"],
    category: "weed",
  },
  "Green Crack": {
    name: "Green Crack",
    basePrice: 35,
    initialEffects: ["Focused"],
    category: "weed",
  },
  "Grandaddy Purple": {
    name: "Grandaddy Purple",
    basePrice: 35,
    initialEffects: ["Sedating"],
    category: "weed",
  },
  Meth: {
    name: "Meth",
    basePrice: 70,
    initialEffects: [],
    category: "stimulant",
  },
  Cocaine: {
    name: "Cocaine",
    basePrice: 150,
    initialEffects: [],
    category: "stimulant",
  },
};

export const getSubstance = (name: SubstanceName): Substance | undefined => {
  return SUBSTANCES[name];
};

export const getAllSubstances = (): SubstanceName[] => {
  return Object.keys(SUBSTANCES) as SubstanceName[];
};

export const getSubstancesByCategory = (
  category: "weed" | "stimulant"
): SubstanceName[] => {
  return Object.entries(SUBSTANCES)
    .filter(([_, substance]) => substance.category === category)
    .map(([name, _]) => name as SubstanceName);
};

export const getSubstanceBasePrice = (name: SubstanceName): number => {
  const substance = getSubstance(name);
  return substance?.basePrice ?? 0;
};
