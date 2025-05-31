/**
 * Ingredients data for Schedule 1 game
 * Based on the official calculator data from schedule1-calculator.com
 * Costs calculated from price differences: (final price - base price)
 */

import type { Ingredient, IngredientName } from "../types/index.js";

export const INGREDIENTS: Record<IngredientName, Ingredient> = {
  Cuke: {
    name: "Cuke",
    cost: 2, // Corrected based on known combination cost
    defaultEffect: "Energizing",
    transformationRules: [
      { condition: "Euphoric", replacement: "Laxative" },
      { condition: "Foggy", replacement: "Cyclopean" },
      { condition: "Gingeritis", replacement: "Thought-Provoking" },
      { condition: "Munchies", replacement: "Athletic" },
      { condition: "Slippery", replacement: "Munchies" },
      { condition: "Sneaky", replacement: "Paranoia" },
      { condition: "Toxic", replacement: "Euphoric" },
    ],
  },
  "Flu Medicine": {
    name: "Flu Medicine",
    cost: 5, // From GameSpot guide
    defaultEffect: "Sedating",
    transformationRules: [
      { condition: "Athletic", replacement: "Munchies" },
      { condition: "Calming", replacement: "Bright-Eyed" },
      { condition: "Cyclopean", replacement: "Foggy" },
      { condition: "Electrifying", replacement: "Refreshing" },
      { condition: "Euphoric", replacement: "Toxic" },
      { condition: "Focused", replacement: "Calming" },
      { condition: "Laxative", replacement: "Euphoric" },
      { condition: "Munchies", replacement: "Slippery" },
      { condition: "Shrinking", replacement: "Paranoia" },
      { condition: "Thought-Provoking", replacement: "Gingeritis" },
    ],
  },
  Gasoline: {
    name: "Gasoline",
    cost: 5, // From GameSpot guide
    defaultEffect: "Toxic",
    transformationRules: [
      { condition: "Disorienting", replacement: "Glowing" },
      { condition: "Electrifying", replacement: "Disorienting" },
      { condition: "Energizing", replacement: "Euphoric" },
      { condition: "Euphoric", replacement: "Spicy" },
      { condition: "Gingeritis", replacement: "Smelly" },
      { condition: "Jennerising", replacement: "Sneaky" },
      { condition: "Laxative", replacement: "Foggy" },
      { condition: "Munchies", replacement: "Sedating" },
      { condition: "Paranoia", replacement: "Calming" },
      { condition: "Shrinking", replacement: "Focused" },
      { condition: "Sneaky", replacement: "Tropic Thunder" },
    ],
  },
  Donut: {
    name: "Donut",
    cost: 3, // From GameSpot guide
    defaultEffect: "Calorie-Dense",
    transformationRules: [
      { condition: "Anti-Gravity", replacement: "Slippery" },
      { condition: "Balding", replacement: "Sneaky" },
      { condition: "Calorie-Dense", replacement: "Explosive" },
      { condition: "Focused", replacement: "Euphoric" },
      { condition: "Jennerising", replacement: "Gingeritis" },
      { condition: "Munchies", replacement: "Calming" },
      { condition: "Shrinking", replacement: "Energizing" },
    ],
  },
  "Energy Drink": {
    name: "Energy Drink",
    cost: 6, // From GameSpot guide
    defaultEffect: "Athletic",
    transformationRules: [
      { condition: "Disorienting", replacement: "Electrifying" },
      { condition: "Euphoric", replacement: "Energizing" },
      { condition: "Focused", replacement: "Shrinking" },
      { condition: "Foggy", replacement: "Laxative" },
      { condition: "Glowing", replacement: "Disorienting" },
      { condition: "Schizophrenia", replacement: "Balding" },
      { condition: "Sedating", replacement: "Munchies" },
      { condition: "Spicy", replacement: "Euphoric" },
      { condition: "Tropic Thunder", replacement: "Sneaky" },
    ],
  },
  "Mouth Wash": {
    name: "Mouth Wash",
    cost: 4, // From GameSpot guide
    defaultEffect: "Balding",
    transformationRules: [
      { condition: "Calming", replacement: "Anti-Gravity" },
      { condition: "Calorie-Dense", replacement: "Sneaky" },
      { condition: "Explosive", replacement: "Sedating" },
      { condition: "Focused", replacement: "Jennerising" },
    ],
  },
  "Motor Oil": {
    name: "Motor Oil",
    cost: 6, // From GameSpot guide
    defaultEffect: "Slippery",
    transformationRules: [
      { condition: "Energizing", replacement: "Munchies" },
      { condition: "Euphoric", replacement: "Sedating" },
      { condition: "Foggy", replacement: "Toxic" },
      { condition: "Munchies", replacement: "Schizophrenia" },
      { condition: "Paranoia", replacement: "Anti-Gravity" },
    ],
  },
  Banana: {
    name: "Banana",
    cost: 2, // From GameSpot guide
    defaultEffect: "Gingeritis",
    transformationRules: [
      { condition: "Calming", replacement: "Sneaky" },
      { condition: "Cyclopean", replacement: "Energizing" },
      { condition: "Disorienting", replacement: "Focused" },
      { condition: "Energizing", replacement: "Thought-Provoking" },
      { condition: "Focused", replacement: "Seizure-Inducing" },
      { condition: "Long Faced", replacement: "Refreshing" },
      { condition: "Paranoia", replacement: "Jennerising" },
      { condition: "Smelly", replacement: "Anti-Gravity" },
      { condition: "Toxic", replacement: "Smelly" },
    ],
  },
  Chili: {
    name: "Chili",
    cost: 7, // From GameSpot guide
    defaultEffect: "Spicy",
    transformationRules: [
      { condition: "Anti-Gravity", replacement: "Tropic Thunder" },
      { condition: "Athletic", replacement: "Euphoric" },
      { condition: "Laxative", replacement: "Long Faced" },
      { condition: "Munchies", replacement: "Toxic" },
      { condition: "Shrinking", replacement: "Refreshing" },
      { condition: "Sneaky", replacement: "Bright-Eyed" },
    ],
  },
  Iodine: {
    name: "Iodine",
    cost: 8, // From GameSpot guide
    defaultEffect: "Jennerising",
    transformationRules: [
      { condition: "Calming", replacement: "Balding" },
      { condition: "Calorie-Dense", replacement: "Gingeritis" },
      { condition: "Euphoric", replacement: "Seizure-Inducing" },
      { condition: "Foggy", replacement: "Paranoia" },
      { condition: "Refreshing", replacement: "Thought-Provoking" },
      { condition: "Toxic", replacement: "Sneaky" },
    ],
  },
  Paracetamol: {
    name: "Paracetamol",
    cost: 3, // From GameSpot guide
    defaultEffect: "Sneaky",
    transformationRules: [
      { condition: "Calming", replacement: "Slippery" },
      { condition: "Electrifying", replacement: "Athletic" },
      { condition: "Energizing", replacement: "Paranoia" },
      { condition: "Focused", replacement: "Gingeritis" },
      { condition: "Foggy", replacement: "Calming" },
      { condition: "Glowing", replacement: "Toxic" },
      { condition: "Munchies", replacement: "Anti-Gravity" },
      { condition: "Paranoia", replacement: "Balding" },
      { condition: "Spicy", replacement: "Bright-Eyed" },
      { condition: "Toxic", replacement: "Tropic Thunder" },
    ],
  },
  Viagra: {
    name: "Viagra",
    cost: 4, // From GameSpot guide
    defaultEffect: "Tropic Thunder",
    transformationRules: [
      { condition: "Athletic", replacement: "Sneaky" },
      { condition: "Disorienting", replacement: "Toxic" },
      { condition: "Euphoric", replacement: "Bright-Eyed" },
      { condition: "Laxative", replacement: "Calming" },
      { condition: "Shrinking", replacement: "Gingeritis" },
    ],
  },
  "Horse Semen": {
    name: "Horse Semen",
    cost: 9, // From GameSpot guide
    defaultEffect: "Long Faced",
    transformationRules: [
      { condition: "Anti-Gravity", replacement: "Calming" },
      { condition: "Gingeritis", replacement: "Refreshing" },
      { condition: "Seizure-Inducing", replacement: "Energizing" },
      { condition: "Thought-Provoking", replacement: "Electrifying" },
    ],
  },
  "Mega Bean": {
    name: "Mega Bean",
    cost: 7, // From GameSpot guide
    defaultEffect: "Foggy",
    transformationRules: [
      { condition: "Athletic", replacement: "Laxative" },
      { condition: "Calming", replacement: "Glowing" },
      { condition: "Energizing", replacement: "Cyclopean" },
      { condition: "Focused", replacement: "Disorienting" },
      { condition: "Jennerising", replacement: "Paranoia" },
      { condition: "Seizure-Inducing", replacement: "Focused" },
      { condition: "Shrinking", replacement: "Electrifying" },
      { condition: "Slippery", replacement: "Toxic" },
      { condition: "Sneaky", replacement: "Calming" },
      { condition: "Thought-Provoking", replacement: "Energizing" },
    ],
  },
  Addy: {
    name: "Addy",
    cost: 9, // From GameSpot guide
    defaultEffect: "Thought-Provoking",
    transformationRules: [
      { condition: "Explosive", replacement: "Euphoric" },
      { condition: "Foggy", replacement: "Energizing" },
      { condition: "Glowing", replacement: "Refreshing" },
      { condition: "Long Faced", replacement: "Electrifying" },
      { condition: "Sedating", replacement: "Gingeritis" },
    ],
  },
  Battery: {
    name: "Battery",
    cost: 8, // From GameSpot guide
    defaultEffect: "Bright-Eyed",
    transformationRules: [
      { condition: "Cyclopean", replacement: "Glowing" },
      { condition: "Electrifying", replacement: "Euphoric" },
      { condition: "Euphoric", replacement: "Zombifying" },
      { condition: "Laxative", replacement: "Calorie-Dense" },
      { condition: "Munchies", replacement: "Tropic Thunder" },
      { condition: "Shrinking", replacement: "Munchies" },
    ],
  },
};

export const getIngredient = (name: IngredientName): Ingredient | undefined => {
  return INGREDIENTS[name];
};

export const getAllIngredients = (): IngredientName[] => {
  return Object.keys(INGREDIENTS) as IngredientName[];
};

export const getIngredientsByPriceRange = (
  min: number,
  max: number
): Ingredient[] => {
  return Object.values(INGREDIENTS).filter(
    (ingredient) => ingredient.cost >= min && ingredient.cost <= max
  );
};

export const getCheapestIngredients = (count: number = 5): Ingredient[] => {
  return Object.values(INGREDIENTS)
    .sort((a, b) => a.cost - b.cost)
    .slice(0, count);
};
