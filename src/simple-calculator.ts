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
console.log(`Total Addiction: ${result.totalAddiction}%`);
console.log();
console.log("✅ Optimization complete!");

// Example with addiction constraint
console.log("\n====================================================");
console.log("🧪 Example with Addiction Constraint (min 50%)");
console.log("====================================================");

const resultWithAddiction = optimizer.findOptimalMix({
  baseProduct: "Cocaine",
  maxSteps: 3,
  // minAddictionLevel: 50,
});

if (resultWithAddiction.totalAddiction >= 50) {
  console.log();
  console.log(`Base Product: ${resultWithAddiction.mixState.baseProduct}`);
  console.log(`Optimal Sequence: ${resultWithAddiction.sequence.join(" → ")}`);
  console.log(`Final Effects: ${resultWithAddiction.finalEffects.join(", ")}`);
  console.log();
  console.log(`Total Cost: $${resultWithAddiction.totalCost.toFixed(2)}`);
  console.log(`Sell Price: $${resultWithAddiction.sellPrice.toFixed(2)}`);
  console.log(`Profit: $${resultWithAddiction.profit.toFixed(2)}`);
  console.log(`Profit Margin: ${resultWithAddiction.profitMargin.toFixed(2)}%`);
  console.log(`Total Addiction: ${resultWithAddiction.totalAddiction}%`);
  console.log();
  console.log("✅ Addiction constraint satisfied!");
} else {
  console.log();
  console.log("❌ No solution found that meets minimum addiction level of 50%");
}
