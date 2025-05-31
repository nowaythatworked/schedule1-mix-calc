import { describe, test, expect, beforeEach } from "vitest";
import { Optimizer } from "../optimizer.js";
import type { OptimizationOptions } from "../../types/index.js";

describe("Optimizer", () => {
  let optimizer: Optimizer;

  beforeEach(() => {
    optimizer = new Optimizer();
  });

  test("should find optimal mix for single step", () => {
    const options: OptimizationOptions = {
      baseProduct: "OG Kush",
      maxSteps: 1,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result).toBeDefined();
    expect(result.sequence).toHaveLength(1);
    expect(result.profit).toBeGreaterThan(0);
    expect(result.finalEffects.length).toBeGreaterThan(0);
  });

  test("should find optimal mix for multiple steps", () => {
    const options: OptimizationOptions = {
      baseProduct: "OG Kush",
      maxSteps: 3,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result).toBeDefined();
    expect(result.sequence).toHaveLength(3);
    expect(result.profit).toBeGreaterThan(0);
  });

  test("should respect budget limit", () => {
    const options: OptimizationOptions = {
      baseProduct: "OG Kush",
      maxSteps: 5,
      budgetLimit: 20, // Low budget
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.totalCost).toBeLessThanOrEqual(20);
  });

  test("should work with different base products", () => {
    const options: OptimizationOptions = {
      baseProduct: "Cocaine",
      maxSteps: 2,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result).toBeDefined();
    expect(result.mixState.baseProduct).toBe("Cocaine");
    expect(result.sequence).toHaveLength(2);
  });

  test("should handle limited available substances", () => {
    const options: OptimizationOptions = {
      baseProduct: "OG Kush",
      maxSteps: 2,
      availableSubstances: ["Cuke", "Banana", "Gasoline"],
    };

    const result = optimizer.findOptimalMix(options);

    expect(result).toBeDefined();
    result.sequence.forEach((substance) => {
      expect(["Cuke", "Banana", "Gasoline"]).toContain(substance);
    });
  });

  test("should return higher profit for more steps (generally)", () => {
    const options1: OptimizationOptions = {
      baseProduct: "OG Kush",
      maxSteps: 1,
    };

    const options2: OptimizationOptions = {
      baseProduct: "OG Kush",
      maxSteps: 3,
    };

    const result1 = optimizer.findOptimalMix(options1);
    const result2 = optimizer.findOptimalMix(options2);

    // More steps should generally lead to higher profit (not always guaranteed due to costs)
    expect(result2.sellPrice).toBeGreaterThanOrEqual(result1.sellPrice);
  });

  test("should calculate profit margin correctly", () => {
    const options: OptimizationOptions = {
      baseProduct: "OG Kush",
      maxSteps: 2,
    };

    const result = optimizer.findOptimalMix(options);

    const expectedMargin = (result.profit / result.sellPrice) * 100;
    expect(Math.abs(result.profitMargin - expectedMargin)).toBeLessThan(0.01);
  });

  test("should handle zero steps (base product only)", () => {
    const options: OptimizationOptions = {
      baseProduct: "OG Kush",
      maxSteps: 0,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.sequence).toHaveLength(0);
    expect(result.totalCost).toBe(0);
    expect(result.finalEffects).toEqual(["Calming"]); // OG Kush initial effect
  });
});
