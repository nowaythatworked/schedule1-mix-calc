/**
 * Integration tests for Multi-Product Optimizer
 */

import { describe, test, expect, beforeEach } from "vitest";
import { MultiProductOptimizer } from "../optimization/multi-product-optimizer.js";
import { Optimizer } from "../optimization/optimizer.js";
import type { MultiSubstanceOptimizationOptions } from "../types/index.js";

describe("MultiProductOptimizer", () => {
  let optimizer: MultiProductOptimizer;
  let singleOptimizer: Optimizer;

  beforeEach(() => {
    optimizer = new MultiProductOptimizer();
    singleOptimizer = new Optimizer();
  });

  test("should handle empty substances array", () => {
    const options: MultiSubstanceOptimizationOptions = {
      baseSubstances: [],
      maxSteps: 3,
    };

    expect(() => optimizer.findOptimalMix(options)).toThrow(
      "At least one base substance must be specified"
    );
  });

  test("should handle zero steps", () => {
    const options: MultiSubstanceOptimizationOptions = {
      baseSubstances: ["OG Kush", "Meth"],
      maxSteps: 0,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.sequence).toHaveLength(0);
    expect(result.totalCost).toBe(0);
    expect(result.substanceResults).toHaveLength(2);
    expect(result.substanceResults[0].substance).toBe("OG Kush");
    expect(result.substanceResults[1].substance).toBe("Meth");
  });

  test("should optimize for single product (equivalent to single optimizer)", () => {
    const multiOptions: MultiSubstanceOptimizationOptions = {
      baseSubstances: ["OG Kush"],
      maxSteps: 3,
    };

    const singleResult = singleOptimizer.findOptimalMix({
      baseSubstance: "OG Kush",
      maxSteps: 3,
    });

    const multiResult = optimizer.findOptimalMix(multiOptions);

    expect(multiResult.sequence).toEqual(singleResult.sequence);
    expect(multiResult.totalCost).toBe(singleResult.totalCost);
    expect(multiResult.totalProfit).toBeCloseTo(singleResult.profit, 2);
    expect(multiResult.substanceResults).toHaveLength(1);
    expect(multiResult.substanceResults[0].substance).toBe("OG Kush");
  });

  test("should optimize for two products: OG Kush and Meth", () => {
    const options: MultiSubstanceOptimizationOptions = {
      baseSubstances: ["OG Kush", "Meth"],
      maxSteps: 3,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.sequence).toHaveLength(3);
    expect(result.substanceResults).toHaveLength(2);
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.totalProfit).toBeGreaterThan(0);
    expect(result.totalSellPrice).toBeGreaterThan(0);

    // Check that both substances are included
    const substanceNames = result.substanceResults.map((r) => r.substance);
    expect(substanceNames).toContain("OG Kush");
    expect(substanceNames).toContain("Meth");

    // Verify profit calculation
    const expectedTotalSellPrice = result.substanceResults.reduce(
      (sum, r) => sum + r.sellPrice,
      0
    );
    expect(result.totalSellPrice).toBeCloseTo(expectedTotalSellPrice, 2);
    expect(result.totalProfit).toBeCloseTo(
      result.totalSellPrice - result.totalCost,
      2
    );
  });

  test("should respect budget constraints", () => {
    const options: MultiSubstanceOptimizationOptions = {
      baseSubstances: ["OG Kush", "Meth"],
      maxSteps: 4,
      budgetLimit: 10,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.totalCost).toBeLessThanOrEqual(10);
    expect(result.sequence.length).toBeLessThanOrEqual(4);
  });

  test("should handle limited available ingredients", () => {
    const options: MultiSubstanceOptimizationOptions = {
      baseSubstances: ["OG Kush", "Meth"],
      maxSteps: 3,
      availableIngredients: ["Cuke", "Banana"],
    };

    const result = optimizer.findOptimalMix(options);

    // All ingredients in sequence should be from available list
    result.sequence.forEach((ingredient) => {
      expect(["Cuke", "Banana"]).toContain(ingredient);
    });
  });

  test("should handle three substances", () => {
    const options: MultiSubstanceOptimizationOptions = {
      baseSubstances: ["OG Kush", "Meth", "Cocaine"],
      maxSteps: 2,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.substanceResults).toHaveLength(3);
    expect(result.sequence).toHaveLength(2);

    const substanceNames = result.substanceResults.map((r) => r.substance);
    expect(substanceNames).toContain("OG Kush");
    expect(substanceNames).toContain("Meth");
    expect(substanceNames).toContain("Cocaine");

    // Higher value substances should contribute more to total
    const cocaineResult = result.substanceResults.find(
      (r) => r.substance === "Cocaine"
    );
    const ogKushResult = result.substanceResults.find(
      (r) => r.substance === "OG Kush"
    );

    expect(cocaineResult).toBeDefined();
    expect(ogKushResult).toBeDefined();
    expect(cocaineResult!.sellPrice).toBeGreaterThan(ogKushResult!.sellPrice);
  });

  test("should provide meaningful profit margins", () => {
    const options: MultiSubstanceOptimizationOptions = {
      baseSubstances: ["OG Kush", "Meth"],
      maxSteps: 3,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.averageProfitMargin).toBeGreaterThan(0);
    expect(result.averageProfitMargin).toBeLessThan(1000); // Reasonable upper bound

    result.substanceResults.forEach((substanceResult) => {
      expect(substanceResult.profitMargin).toBeGreaterThanOrEqual(0);
      expect(substanceResult.profit).toBeLessThanOrEqual(
        substanceResult.sellPrice
      );
    });
  });

  test("should find better combined solution than separate optimizations in some cases", () => {
    const options: MultiSubstanceOptimizationOptions = {
      baseSubstances: ["OG Kush", "Meth"],
      maxSteps: 3,
    };

    // Get multi-substance result
    const multiResult = optimizer.findOptimalMix(options);

    // Get individual results
    const ogKushResult = singleOptimizer.findOptimalMix({
      baseSubstance: "OG Kush",
      maxSteps: 3,
    });

    const methResult = singleOptimizer.findOptimalMix({
      baseSubstance: "Meth",
      maxSteps: 3,
    });

    const combinedIndividualCost =
      ogKushResult.totalCost + methResult.totalCost;
    const combinedIndividualProfit = ogKushResult.profit + methResult.profit;

    // Multi-substance should have lower or equal cost (shared sequence)
    expect(multiResult.totalCost).toBeLessThanOrEqual(combinedIndividualCost);

    // The key advantage is cost savings from shared sequence
    const costSavings = combinedIndividualCost - multiResult.totalCost;
    expect(costSavings).toBeGreaterThanOrEqual(0);

    console.log(`Cost savings: $${costSavings.toFixed(2)}`);
    console.log(
      `Multi-substance profit: $${multiResult.totalProfit.toFixed(2)}`
    );
    console.log(
      `Combined individual profit: $${combinedIndividualProfit.toFixed(2)}`
    );
  });

  test("should handle edge case with very limited budget", () => {
    const options: MultiSubstanceOptimizationOptions = {
      baseSubstances: ["OG Kush", "Meth"],
      maxSteps: 3,
      budgetLimit: 1, // Very low budget
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.totalCost).toBeLessThanOrEqual(1);
    expect(result.sequence.length).toBeLessThanOrEqual(3);
    // Should still return a valid result, even if no ingredients can be applied
  });

  test("should maintain consistent state across substances", () => {
    const options: MultiSubstanceOptimizationOptions = {
      baseSubstances: ["OG Kush", "Meth", "Cocaine"],
      maxSteps: 2,
    };

    const result = optimizer.findOptimalMix(options);

    // All substances should have used the same sequence
    result.substanceResults.forEach((substanceResult) => {
      expect(substanceResult.mixState.ingredientsUsed).toEqual(result.sequence);
      expect(substanceResult.mixState.totalCost).toBe(result.totalCost);
    });
  });
});
