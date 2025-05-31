/**
 * Main entry point for Schedule 1 Calculator
 * Demonstrates the optimization engine capabilities
 */

import { Optimizer } from "./optimization/optimizer.js";
import { MultiProductOptimizer } from "./optimization/multi-product-optimizer.js";
import type {
  OptimizationOptions,
  ProductName,
  MultiProductOptimizationOptions,
} from "./types/index.js";

function formatResult(result: any) {
  console.log("\n=== OPTIMIZATION RESULT ===");
  console.log(`Base Product: ${result.mixState.baseProduct}`);
  console.log(`Mixing Sequence: ${result.sequence.join(" → ")}`);
  console.log(`Final Effects: ${result.finalEffects.join(", ")}`);
  console.log(`Total Cost: $${result.totalCost.toFixed(2)}`);
  console.log(`Sell Price: $${result.sellPrice.toFixed(2)}`);
  console.log(`Profit: $${result.profit.toFixed(2)}`);
  console.log(`Profit Margin: ${result.profitMargin.toFixed(2)}%`);
  console.log("===========================\n");
}

function main() {
  console.log("🧪 Schedule 1 Optimal Mixing Calculator");
  console.log("========================================\n");

  const optimizer = new Optimizer();

  // Example 1: Simple optimization for OG Kush with 3 steps
  console.log("Example 1: OG Kush with 3 mixing steps");
  const options1: OptimizationOptions = {
    baseProduct: "OG Kush",
    maxSteps: 3,
  };

  const result1 = optimizer.findOptimalMix(options1);
  formatResult(result1);

  // Example 2: High-value product (Cocaine) with budget constraint
  console.log("Example 2: Cocaine with budget limit of $30");
  const options2: OptimizationOptions = {
    baseProduct: "Cocaine",
    maxSteps: 5,
    budgetLimit: 30,
  };

  const result2 = optimizer.findOptimalMix(options2);
  formatResult(result2);

  // Example 3: Limited substances available
  console.log("Example 3: Meth with limited substances");
  const options3: OptimizationOptions = {
    baseProduct: "Meth",
    maxSteps: 4,
    availableSubstances: ["Cuke", "Banana", "Chili", "Battery", "Viagra"],
  };

  const result3 = optimizer.findOptimalMix(options3);
  formatResult(result3);

  // Example 4: Multi-product optimization
  console.log("Example 4: Multi-product optimization (OG Kush & Meth)");
  const multiOptimizer = new MultiProductOptimizer();
  const multiOptions: MultiProductOptimizationOptions = {
    baseProducts: ["OG Kush", "Meth"],
    maxSteps: 3,
  };

  const multiResult = multiOptimizer.findOptimalMix(multiOptions);
  console.log("\n=== MULTI-PRODUCT OPTIMIZATION RESULT ===");
  console.log(
    `Products: ${multiResult.productResults.map((r) => r.product).join(" & ")}`
  );
  console.log(`Shared Sequence: ${multiResult.sequence.join(" → ")}`);
  console.log(`Total Cost: $${multiResult.totalCost.toFixed(2)}`);
  console.log(`Total Sell Price: $${multiResult.totalSellPrice.toFixed(2)}`);
  console.log(`Total Profit: $${multiResult.totalProfit.toFixed(2)}`);
  console.log(
    `Average Profit Margin: ${multiResult.averageProfitMargin.toFixed(2)}%`
  );
  console.log("\nIndividual Results:");
  multiResult.productResults.forEach((productResult) => {
    console.log(
      `  ${productResult.product}: $${productResult.sellPrice.toFixed(
        2
      )} (${productResult.profitMargin.toFixed(1)}% margin)`
    );
  });
  console.log("==========================================\n");

  // Performance comparison
  console.log("Performance Comparison: Different step counts for OG Kush");
  console.log("--------------------------------------------------------");

  for (let steps = 1; steps <= 5; steps++) {
    const options: OptimizationOptions = {
      baseProduct: "OG Kush",
      maxSteps: steps,
    };

    const startTime = performance.now();
    const result = optimizer.findOptimalMix(options);
    const endTime = performance.now();

    console.log(
      `${steps} steps: Profit $${result.profit.toFixed(2)}, Time: ${(
        endTime - startTime
      ).toFixed(2)}ms`
    );
  }

  console.log("\n✅ Calculator demonstration complete!");
  console.log("💡 This engine can handle complex optimization scenarios with:");
  console.log("   - Variable step counts");
  console.log("   - Budget constraints");
  console.log("   - Limited substance availability");
  console.log("   - Multi-product optimization (shared sequences)");
  console.log("   - Complex effect transformation rules");
}

// Run the main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
