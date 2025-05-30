/**
 * Simple Schedule 1 Calculator - Minimal Example
 * Calculates optimal 3-step mix for OG Kush
 */

import { Optimizer } from "./optimization/optimizer.js";

// Create optimizer instance
const optimizer = new Optimizer();

// Calculate optimal 3-step mix for OG Kush
const result = optimizer.findOptimalMix({
  baseProduct: "OG Kush",
  maxSteps: 4,
});

// Display results
console.log("====================================================");
console.log();
console.log(`Base Product: ${result.mixState.baseProduct}`);
console.log(`Optimal Sequence: ${result.sequence.join(" → ")}`);
console.log(`Final Effects: ${result.finalEffects.join(", ")}`);
console.log();
console.log(`Total Cost: $${result.totalCost.toFixed(2)}`);
console.log(`Sell Price: $${result.sellPrice.toFixed(2)}`);
console.log(`Profit: $${result.profit.toFixed(2)}`);
console.log(`Profit Margin: ${result.profitMargin.toFixed(2)}%`);
console.log();
console.log("✅ Optimization complete!");
