import { describe, test, expect } from "vitest";
import {
  getSubstance,
  getAllSubstances,
  getSubstancesByPriceRange,
  SUBSTANCES,
} from "../substances.js";
import type { SubstanceName } from "../../types/index.js";

describe("Substances Data", () => {
  test("should have all 16 substances defined", () => {
    const substanceNames = getAllSubstances();
    expect(substanceNames).toHaveLength(16);
  });

  test("should return correct substance data for Cuke", () => {
    const substance = getSubstance("Cuke");
    expect(substance).toEqual({
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

  test("should return correct substance data for Flu Medicine", () => {
    const substance = getSubstance("Flu Medicine");
    expect(substance?.name).toBe("Flu Medicine");
    expect(substance?.defaultEffect).toBe("Sedating");
    expect(substance?.transformationRules).toHaveLength(10);
  });

  test("should return undefined for non-existent substance", () => {
    const substance = getSubstance("Non-Existent" as SubstanceName);
    expect(substance).toBeUndefined();
  });

  test("should have correct costs from GameSpot guide", () => {
    // Based on official GameSpot guide costs
    expect(getSubstance("Cuke")?.cost).toBe(2); // GameSpot guide
    expect(getSubstance("Banana")?.cost).toBe(2); // GameSpot guide
    expect(getSubstance("Paracetamol")?.cost).toBe(3); // GameSpot guide
    expect(getSubstance("Donut")?.cost).toBe(3); // GameSpot guide
    expect(getSubstance("Viagra")?.cost).toBe(4); // GameSpot guide
    expect(getSubstance("Gasoline")?.cost).toBe(5); // GameSpot guide
    expect(getSubstance("Mega Bean")?.cost).toBe(7); // GameSpot guide
    expect(getSubstance("Horse Semen")?.cost).toBe(9); // GameSpot guide
  });

  test("should return substances in price range", () => {
    const cheapSubstances = getSubstancesByPriceRange(0, 5);
    expect(cheapSubstances.length).toBeGreaterThan(0);

    const expensiveSubstances = getSubstancesByPriceRange(8, 10);
    expect(expensiveSubstances.length).toBeGreaterThan(0);
  });

  test("should have all substances in SUBSTANCES object", () => {
    const expectedSubstances: SubstanceName[] = [
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

    expectedSubstances.forEach((substanceName) => {
      expect(SUBSTANCES[substanceName]).toBeDefined();
      expect(SUBSTANCES[substanceName]?.name).toBe(substanceName);
      expect(typeof SUBSTANCES[substanceName]?.cost).toBe("number");
      expect(
        Array.isArray(SUBSTANCES[substanceName]?.transformationRules)
      ).toBe(true);
    });
  });

  test("should have valid transformation rules", () => {
    const cuke = getSubstance("Cuke");
    expect(cuke?.transformationRules).toBeDefined();

    cuke?.transformationRules.forEach((rule) => {
      expect(typeof rule.condition).toBe("string");
      expect(typeof rule.replacement).toBe("string");
      expect(rule.condition.length).toBeGreaterThan(0);
      expect(rule.replacement.length).toBeGreaterThan(0);
    });
  });
});
