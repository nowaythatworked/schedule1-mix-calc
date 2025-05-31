import { describe, test, expect, beforeEach } from "vitest";
import { Optimizer } from "../optimization/optimizer.js";
import type { OptimizationOptions } from "../types/index.js";

describe("Integration Tests", () => {
  let optimizer: Optimizer;

  beforeEach(() => {
    optimizer = new Optimizer();
  });

  test("should find profitable mixes for all base substances", () => {
    const substances = [
      "OG Kush",
      "Sour Diesel",
      "Green Crack",
      "Grandaddy Purple",
      "Meth",
      "Cocaine",
    ] as const;

    substances.forEach((substance) => {
      const options: OptimizationOptions = {
        baseSubstance: substance,
        maxSteps: 2,
      };

      const result = optimizer.findOptimalMix(options);

      expect(result).toBeDefined();
      expect(result.profit).toBeGreaterThan(0);
      expect(result.sequence).toHaveLength(2);
      expect(result.mixState.baseSubstance).toBe(substance);
    });
  });

  test("should handle complex optimization scenario", () => {
    const options: OptimizationOptions = {
      baseSubstance: "Cocaine",
      maxSteps: 4,
      budgetLimit: 50,
      availableIngredients: [
        "Cuke",
        "Flu Medicine",
        "Donut",
        "Energy Drink",
        "Banana",
        "Chili",
      ],
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.totalCost).toBeLessThanOrEqual(50);
    expect(result.sequence).toHaveLength(4);
    expect(result.profit).toBeGreaterThan(100); // Should be quite profitable with Cocaine
    expect(result.profitMargin).toBeGreaterThan(50); // Should have good margin

    // Verify all ingredients used are from available list
    result.sequence.forEach((ingredient) => {
      expect(options.availableIngredients).toContain(ingredient);
    });
  });

  test("should demonstrate scaling performance", () => {
    const baseOptions: OptimizationOptions = {
      baseSubstance: "OG Kush",
      maxSteps: 1,
    };

    // Test different step counts and measure performance
    for (let steps = 1; steps <= 4; steps++) {
      const options = { ...baseOptions, maxSteps: steps };

      const startTime = performance.now();
      const result = optimizer.findOptimalMix(options);
      const endTime = performance.now();

      const duration = endTime - startTime;

      expect(result).toBeDefined();
      expect(result.sequence).toHaveLength(steps);
      expect(duration).toBeLessThan(100); // Should complete within 100ms

      console.log(
        `${steps} steps: ${duration.toFixed(
          2
        )}ms, profit: $${result.profit.toFixed(2)}`
      );
    }
  });

  test("should validate game mechanics accuracy", () => {
    // Test known transformation: Banana transforms Calming to Sneaky
    const options: OptimizationOptions = {
      baseSubstance: "OG Kush", // Has Calming effect
      maxSteps: 1,
      availableIngredients: ["Banana"],
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.finalEffects).toContain("Sneaky"); // Calming transformed to Sneaky
    expect(result.finalEffects).not.toContain("Calming"); // Original effect should be gone
    expect(result.finalEffects).toContain("Gingeritis"); // Banana's default effect
  });

  test("should respect 8-effect limit", () => {
    const options: OptimizationOptions = {
      baseSubstance: "OG Kush",
      maxSteps: 8, // Try to add many ingredients
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.finalEffects.length).toBeLessThanOrEqual(8);
  });

  test("should find different optimal solutions for different constraints", () => {
    const baseOptions: OptimizationOptions = {
      baseSubstance: "Meth",
      maxSteps: 4, // Increase steps to ensure unconstrained uses more budget
    };

    // Unconstrained optimization
    const unconstrainedResult = optimizer.findOptimalMix(baseOptions);

    // Budget-constrained optimization with tight budget
    const constrainedResult = optimizer.findOptimalMix({
      ...baseOptions,
      budgetLimit: 8, // Tighter budget to force different solution
    });

    // Results should be different due to constraints
    expect(constrainedResult.totalCost).toBeLessThanOrEqual(8);
    expect(constrainedResult.totalCost).toBeLessThanOrEqual(
      unconstrainedResult.totalCost
    );

    // Unconstrained should generally have higher or equal profit
    expect(unconstrainedResult.sellPrice).toBeGreaterThanOrEqual(
      constrainedResult.sellPrice
    );

    // If costs are different, sequences should be different
    if (constrainedResult.totalCost < unconstrainedResult.totalCost) {
      expect(constrainedResult.sequence).not.toEqual(
        unconstrainedResult.sequence
      );
    }
  });
});
