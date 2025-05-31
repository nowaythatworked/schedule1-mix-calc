import { describe, test, expect } from "vitest";
import {
  getIngredient,
  getAllIngredients,
  getIngredientsByPriceRange,
  INGREDIENTS,
} from "../ingredients.js";
import type { IngredientName } from "../../types/index.js";

describe("Ingredients Data", () => {
  test("should have all 16 ingredients defined", () => {
    const ingredientNames = getAllIngredients();
    expect(ingredientNames).toHaveLength(16);
  });

  test("should return correct ingredient data for Cuke", () => {
    const ingredient = getIngredient("Cuke");
    expect(ingredient).toEqual({
      name: "Cuke",
      cost: 2, // From GameSpot guide
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
    });
  });

  test("should return correct ingredient data for Flu Medicine", () => {
    const ingredient = getIngredient("Flu Medicine");
    expect(ingredient?.name).toBe("Flu Medicine");
    expect(ingredient?.defaultEffect).toBe("Sedating");
    expect(ingredient?.transformationRules).toHaveLength(10);
  });

  test("should return undefined for non-existent ingredient", () => {
    const ingredient = getIngredient("Non-Existent" as IngredientName);
    expect(ingredient).toBeUndefined();
  });

  test("should have correct costs from GameSpot guide", () => {
    // Based on official GameSpot guide costs
    expect(getIngredient("Cuke")?.cost).toBe(2); // GameSpot guide
    expect(getIngredient("Banana")?.cost).toBe(2); // GameSpot guide
    expect(getIngredient("Paracetamol")?.cost).toBe(3); // GameSpot guide
    expect(getIngredient("Donut")?.cost).toBe(3); // GameSpot guide
    expect(getIngredient("Viagra")?.cost).toBe(4); // GameSpot guide
    expect(getIngredient("Gasoline")?.cost).toBe(5); // GameSpot guide
    expect(getIngredient("Mega Bean")?.cost).toBe(7); // GameSpot guide
    expect(getIngredient("Horse Semen")?.cost).toBe(9); // GameSpot guide
  });

  test("should return ingredients in price range", () => {
    const cheapIngredients = getIngredientsByPriceRange(0, 5);
    expect(cheapIngredients.length).toBeGreaterThan(0);

    const expensiveIngredients = getIngredientsByPriceRange(8, 10);
    expect(expensiveIngredients.length).toBeGreaterThan(0);
  });

  test("should have all ingredients in INGREDIENTS object", () => {
    const expectedIngredients: IngredientName[] = [
      "Cuke",
      "Flu Medicine",
      "Gasoline",
      "Donut",
      "Energy Drink",
      "Mouth Wash",
      "Motor Oil",
      "Banana",
      "Chili",
      "Iodine",
      "Paracetamol",
      "Viagra",
      "Horse Semen",
      "Mega Bean",
      "Addy",
      "Battery",
    ];

    expectedIngredients.forEach((ingredientName) => {
      expect(INGREDIENTS[ingredientName]).toBeDefined();
      expect(INGREDIENTS[ingredientName]?.name).toBe(ingredientName);
      expect(typeof INGREDIENTS[ingredientName]?.cost).toBe("number");
      expect(
        Array.isArray(INGREDIENTS[ingredientName]?.transformationRules)
      ).toBe(true);
    });
  });

  test("should have valid transformation rules", () => {
    const cuke = getIngredient("Cuke");
    expect(cuke?.transformationRules).toBeDefined();

    cuke?.transformationRules.forEach((rule) => {
      expect(typeof rule.condition).toBe("string");
      expect(typeof rule.replacement).toBe("string");
      expect(rule.condition.length).toBeGreaterThan(0);
      expect(rule.replacement.length).toBeGreaterThan(0);
    });
  });
});
