import { describe, test, expect } from "vitest";
import {
  getSubstance,
  getAllSubstances,
  getSubstancesByCategory,
  SUBSTANCES,
} from "../substances.js";
import type { SubstanceName } from "../../types/index.js";

describe("Substances Data", () => {
  test("should have all 6 substances defined", () => {
    const substanceNames = getAllSubstances();
    expect(substanceNames).toHaveLength(6);
  });

  test("should return correct substance data for OG Kush", () => {
    const substance = getSubstance("OG Kush");
    expect(substance).toEqual({
      name: "OG Kush",
      basePrice: 35,
      initialEffects: ["Calming"],
      category: "weed",
    });
  });

  test("should return correct substance data for Meth", () => {
    const substance = getSubstance("Meth");
    expect(substance).toEqual({
      name: "Meth",
      basePrice: 70,
      initialEffects: [],
      category: "stimulant",
    });
  });

  test("should return correct substance data for Cocaine", () => {
    const substance = getSubstance("Cocaine");
    expect(substance).toEqual({
      name: "Cocaine",
      basePrice: 150,
      initialEffects: [],
      category: "stimulant",
    });
  });

  test("should return undefined for non-existent substance", () => {
    const substance = getSubstance("Non-Existent" as SubstanceName);
    expect(substance).toBeUndefined();
  });

  test("should return weed substances by category", () => {
    const weedSubstances = getSubstancesByCategory("weed");
    expect(weedSubstances).toEqual([
      "OG Kush",
      "Sour Diesel",
      "Green Crack",
      "Grandaddy Purple",
    ]);
  });

  test("should return stimulant substances by category", () => {
    const stimulantSubstances = getSubstancesByCategory("stimulant");
    expect(stimulantSubstances).toEqual(["Meth", "Cocaine"]);
  });

  test("should have correct base prices", () => {
    expect(getSubstance("OG Kush")?.basePrice).toBe(35);
    expect(getSubstance("Sour Diesel")?.basePrice).toBe(35);
    expect(getSubstance("Green Crack")?.basePrice).toBe(35);
    expect(getSubstance("Grandaddy Purple")?.basePrice).toBe(35);
    expect(getSubstance("Meth")?.basePrice).toBe(70);
    expect(getSubstance("Cocaine")?.basePrice).toBe(150);
  });

  test("should have all substances in SUBSTANCES object", () => {
    const expectedSubstances: SubstanceName[] = [
      "OG Kush",
      "Sour Diesel",
      "Green Crack",
      "Grandaddy Purple",
      "Meth",
      "Cocaine",
    ];

    expectedSubstances.forEach((substanceName) => {
      expect(SUBSTANCES[substanceName]).toBeDefined();
      expect(SUBSTANCES[substanceName]?.name).toBe(substanceName);
      expect(typeof SUBSTANCES[substanceName]?.basePrice).toBe("number");
      expect(Array.isArray(SUBSTANCES[substanceName]?.initialEffects)).toBe(
        true
      );
      expect(["weed", "stimulant"]).toContain(
        SUBSTANCES[substanceName]?.category
      );
    });
  });
});
