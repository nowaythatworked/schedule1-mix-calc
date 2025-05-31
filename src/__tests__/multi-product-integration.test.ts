/**
 * Integration tests for Multi-Product Optimizer
 */

import { describe, test, expect, beforeEach } from "vitest";
import { MultiProductOptimizer } from "../optimization/multi-product-optimizer.js";
import { Optimizer } from "../optimization/optimizer.js";
import type { MultiProductOptimizationOptions } from "../types/index.js";

describe("MultiProductOptimizer", () => {
  let optimizer: MultiProductOptimizer;
  let singleOptimizer: Optimizer;

  beforeEach(() => {
    optimizer = new MultiProductOptimizer();
    singleOptimizer = new Optimizer();
  });

  test("should handle empty products array", () => {
    const options: MultiProductOptimizationOptions = {
      baseProducts: [],
      maxSteps: 3,
    };

    expect(() => optimizer.findOptimalMix(options)).toThrow(
      "At least one base product must be specified"
    );
  });

  test("should handle zero steps", () => {
    const options: MultiProductOptimizationOptions = {
      baseProducts: ["OG Kush", "Meth"],
      maxSteps: 0,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.sequence).toHaveLength(0);
    expect(result.totalCost).toBe(0);
    expect(result.productResults).toHaveLength(2);
    expect(result.productResults[0].product).toBe("OG Kush");
    expect(result.productResults[1].product).toBe("Meth");
  });

  test("should optimize for single product (equivalent to single optimizer)", () => {
    const multiOptions: MultiProductOptimizationOptions = {
      baseProducts: ["OG Kush"],
      maxSteps: 3,
    };

    const singleResult = singleOptimizer.findOptimalMix({
      baseProduct: "OG Kush",
      maxSteps: 3,
    });

    const multiResult = optimizer.findOptimalMix(multiOptions);

    expect(multiResult.sequence).toEqual(singleResult.sequence);
    expect(multiResult.totalCost).toBe(singleResult.totalCost);
    expect(multiResult.totalProfit).toBeCloseTo(singleResult.profit, 2);
    expect(multiResult.productResults).toHaveLength(1);
    expect(multiResult.productResults[0].product).toBe("OG Kush");
  });

  test("should optimize for two products: OG Kush and Meth", () => {
    const options: MultiProductOptimizationOptions = {
      baseProducts: ["OG Kush", "Meth"],
      maxSteps: 3,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.sequence).toHaveLength(3);
    expect(result.productResults).toHaveLength(2);
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.totalProfit).toBeGreaterThan(0);
    expect(result.totalSellPrice).toBeGreaterThan(0);

    // Check that both products are included
    const productNames = result.productResults.map(r => r.product);
    expect(productNames).toContain("OG Kush");
    expect(productNames).toContain("Meth");

    // Verify profit calculation
    const expectedTotalSellPrice = result.productResults.reduce(
      (sum, r) => sum + r.sellPrice, 0
    );
    expect(result.totalSellPrice).toBeCloseTo(expectedTotalSellPrice, 2);
    expect(result.totalProfit).toBeCloseTo(result.totalSellPrice - result.totalCost, 2);
  });

  test("should respect budget constraints", () => {
    const options: MultiProductOptimizationOptions = {
      baseProducts: ["OG Kush", "Meth"],
      maxSteps: 4,
      budgetLimit: 10,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.totalCost).toBeLessThanOrEqual(10);
    expect(result.sequence.length).toBeLessThanOrEqual(4);
  });

  test("should handle limited available substances", () => {
    const options: MultiProductOptimizationOptions = {
      baseProducts: ["OG Kush", "Meth"],
      maxSteps: 3,
      availableSubstances: ["Cuke", "Banana"],
    };

    const result = optimizer.findOptimalMix(options);

    // All substances in sequence should be from available list
    result.sequence.forEach(substance => {
      expect(["Cuke", "Banana"]).toContain(substance);
    });
  });

  test("should handle three products", () => {
    const options: MultiProductOptimizationOptions = {
      baseProducts: ["OG Kush", "Meth", "Cocaine"],
      maxSteps: 2,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.productResults).toHaveLength(3);
    expect(result.sequence).toHaveLength(2);

    const productNames = result.productResults.map(r => r.product);
    expect(productNames).toContain("OG Kush");
    expect(productNames).toContain("Meth");
    expect(productNames).toContain("Cocaine");

    // Higher value products should contribute more to total
    const cocaineResult = result.productResults.find(r => r.product === "Cocaine");
    const ogKushResult = result.productResults.find(r => r.product === "OG Kush");
    
    expect(cocaineResult).toBeDefined();
    expect(ogKushResult).toBeDefined();
    expect(cocaineResult!.sellPrice).toBeGreaterThan(ogKushResult!.sellPrice);
  });

  test("should provide meaningful profit margins", () => {
    const options: MultiProductOptimizationOptions = {
      baseProducts: ["OG Kush", "Meth"],
      maxSteps: 3,
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.averageProfitMargin).toBeGreaterThan(0);
    expect(result.averageProfitMargin).toBeLessThan(1000); // Reasonable upper bound

    result.productResults.forEach(productResult => {
      expect(productResult.profitMargin).toBeGreaterThanOrEqual(0);
      expect(productResult.profit).toBeLessThanOrEqual(productResult.sellPrice);
    });
  });

  test("should find better combined solution than separate optimizations in some cases", () => {
    const options: MultiProductOptimizationOptions = {
      baseProducts: ["OG Kush", "Meth"],
      maxSteps: 3,
    };

    // Get multi-product result
    const multiResult = optimizer.findOptimalMix(options);

    // Get individual results
    const ogKushResult = singleOptimizer.findOptimalMix({
      baseProduct: "OG Kush",
      maxSteps: 3,
    });

    const methResult = singleOptimizer.findOptimalMix({
      baseProduct: "Meth",
      maxSteps: 3,
    });

    const combinedIndividualCost = ogKushResult.totalCost + methResult.totalCost;
    const combinedIndividualProfit = ogKushResult.profit + methResult.profit;

    // Multi-product should have lower or equal cost (shared sequence)
    expect(multiResult.totalCost).toBeLessThanOrEqual(combinedIndividualCost);

    // The key advantage is cost savings from shared sequence
    const costSavings = combinedIndividualCost - multiResult.totalCost;
    expect(costSavings).toBeGreaterThanOrEqual(0);

    console.log(`Cost savings: $${costSavings.toFixed(2)}`);
    console.log(`Multi-product profit: $${multiResult.totalProfit.toFixed(2)}`);
    console.log(`Combined individual profit: $${combinedIndividualProfit.toFixed(2)}`);
  });

  test("should handle edge case with very limited budget", () => {
    const options: MultiProductOptimizationOptions = {
      baseProducts: ["OG Kush", "Meth"],
      maxSteps: 3,
      budgetLimit: 1, // Very low budget
    };

    const result = optimizer.findOptimalMix(options);

    expect(result.totalCost).toBeLessThanOrEqual(1);
    expect(result.sequence.length).toBeLessThanOrEqual(3);
    // Should still return a valid result, even if no substances can be applied
  });

  test("should maintain consistent state across products", () => {
    const options: MultiProductOptimizationOptions = {
      baseProducts: ["OG Kush", "Meth", "Cocaine"],
      maxSteps: 2,
    };

    const result = optimizer.findOptimalMix(options);

    // All products should have used the same sequence
    result.productResults.forEach(productResult => {
      expect(productResult.mixState.substancesUsed).toEqual(result.sequence);
      expect(productResult.mixState.totalCost).toBe(result.totalCost);
    });
  });
});
