/**
 * Multi-Product Schedule 1 Calculator - Example Usage
 * Calculates optimal substance sequence for multiple products simultaneously
 */

import { MultiProductOptimizer } from "./optimization/multi-product-optimizer.js";
import type { MultiProductOptimizationOptions } from "./types/index.js";

// Create multi-product optimizer instance
const optimizer = new MultiProductOptimizer();

// Example 1: Find optimal 3-step mix for OG Kush and Meth
console.log("=== Multi-Product Optimization: OG Kush & Meth (3 steps) ===");

const options1: MultiProductOptimizationOptions = {
  baseProducts: ["OG Kush", "Meth"],
  maxSteps: 3,
};

const result1 = optimizer.findOptimalMix(options1);

console.log(`\nOptimal sequence: ${result1.sequence.join(" → ")}`);
console.log(`Total cost: $${result1.totalCost.toFixed(2)}`);
console.log(`Total sell price: $${result1.totalSellPrice.toFixed(2)}`);
console.log(`Total profit: $${result1.totalProfit.toFixed(2)}`);
console.log(
  `Average profit margin: ${result1.averageProfitMargin.toFixed(1)}%`
);

console.log("\nIndividual product results:");
result1.productResults.forEach((productResult) => {
  console.log(`  ${productResult.product}:`);
  console.log(`    Sell price: $${productResult.sellPrice.toFixed(2)}`);
  console.log(`    Individual profit: $${productResult.profit.toFixed(2)}`);
  console.log(`    Profit margin: ${productResult.profitMargin.toFixed(1)}%`);
  console.log(`    Total addiction: ${productResult.totalAddiction}%`);
  console.log(`    Effects: ${productResult.finalEffects.join(", ")}`);
});

// Example 2: Find optimal mix with budget constraint
console.log("\n\n=== Multi-Product Optimization with Budget Limit ===");

const options2: MultiProductOptimizationOptions = {
  baseProducts: ["OG Kush", "Meth"],
  maxSteps: 4,
  budgetLimit: 15, // Limited budget
  availableSubstances: ["Cuke", "Banana", "Chili", "Paracetamol"], // Limited substances
};

const result2 = optimizer.findOptimalMix(options2);

console.log(`\nOptimal sequence: ${result2.sequence.join(" → ")}`);
console.log(`Total cost: $${result2.totalCost.toFixed(2)} (Budget: $15)`);
console.log(`Total sell price: $${result2.totalSellPrice.toFixed(2)}`);
console.log(`Total profit: $${result2.totalProfit.toFixed(2)}`);
console.log(
  `Average profit margin: ${result2.averageProfitMargin.toFixed(1)}%`
);

// Example 3: Compare with individual optimizations
console.log(
  "\n\n=== Comparison: Multi-Product vs Individual Optimizations ==="
);

import { Optimizer } from "./optimization/optimizer.js";
const singleOptimizer = new Optimizer();

// Individual optimization for OG Kush
const ogKushResult = singleOptimizer.findOptimalMix({
  baseProduct: "OG Kush",
  maxSteps: 3,
});

// Individual optimization for Meth
const methResult = singleOptimizer.findOptimalMix({
  baseProduct: "Meth",
  maxSteps: 3,
});

console.log("\nIndividual optimizations:");
console.log(
  `OG Kush optimal: ${ogKushResult.sequence.join(
    " → "
  )} (Profit: $${ogKushResult.profit.toFixed(2)})`
);
console.log(
  `Meth optimal: ${methResult.sequence.join(
    " → "
  )} (Profit: $${methResult.profit.toFixed(2)})`
);
console.log(
  `Combined individual profits: $${(
    ogKushResult.profit + methResult.profit
  ).toFixed(2)}`
);
console.log(
  `Combined individual costs: $${(
    ogKushResult.totalCost + methResult.totalCost
  ).toFixed(2)}`
);

console.log("\nMulti-product optimization:");
console.log(
  `Shared sequence: ${result1.sequence.join(
    " → "
  )} (Total profit: $${result1.totalProfit.toFixed(2)})`
);
console.log(`Shared cost: $${result1.totalCost.toFixed(2)}`);

const savings =
  ogKushResult.totalCost + methResult.totalCost - result1.totalCost;
const profitDifference =
  result1.totalProfit - (ogKushResult.profit + methResult.profit);

console.log(`\nCost savings from shared sequence: $${savings.toFixed(2)}`);
console.log(
  `Profit difference: $${profitDifference.toFixed(2)} ${
    profitDifference >= 0 ? "(Better)" : "(Worse)"
  }`
);

// Example 4: Three products
console.log("\n\n=== Three Products: OG Kush, Meth & Cocaine ===");

const options3: MultiProductOptimizationOptions = {
  baseProducts: ["OG Kush", "Meth", "Cocaine"],
  maxSteps: 3,
  budgetLimit: 25,
};

const result3 = optimizer.findOptimalMix(options3);

console.log(`\nOptimal sequence: ${result3.sequence.join(" → ")}`);
console.log(`Total cost: $${result3.totalCost.toFixed(2)}`);
console.log(`Total sell price: $${result3.totalSellPrice.toFixed(2)}`);
console.log(`Total profit: $${result3.totalProfit.toFixed(2)}`);
console.log(
  `Average profit margin: ${result3.averageProfitMargin.toFixed(1)}%`
);

console.log("\nBreakdown by product:");
result3.productResults.forEach((productResult) => {
  console.log(
    `  ${productResult.product}: $${productResult.sellPrice.toFixed(
      2
    )} (${productResult.profitMargin.toFixed(1)}% margin, addiction: ${
      productResult.totalAddiction
    }%)`
  );
});

// Example 5: Multi-product optimization with addiction constraint
console.log("\n\n=== Multi-Product with Addiction Constraint (min 50%) ===");

const options4: MultiProductOptimizationOptions = {
  baseProducts: ["OG Kush", "Meth", "Cocaine"],
  maxSteps: 3,
  minAddictionLevel: 90,
};

const result4 = optimizer.findOptimalMix(options4);

if (result4.productResults.every((p) => p.totalAddiction >= 50)) {
  console.log(`\nOptimal sequence: ${result4.sequence.join(" → ")}`);
  console.log(`Total cost: $${result4.totalCost.toFixed(2)}`);
  console.log(`Total sell price: $${result4.totalSellPrice.toFixed(2)}`);
  console.log(`Total profit: $${result4.totalProfit.toFixed(2)}`);
  console.log(
    `Average profit margin: ${result4.averageProfitMargin.toFixed(1)}%`
  );

  console.log("\nProduct results (all meet min addiction 50%):");
  result4.productResults.forEach((productResult) => {
    console.log(
      `  ${productResult.product}: addiction ${
        productResult.totalAddiction
      }%, profit $${productResult.profit.toFixed(2)}`
    );
  });
} else {
  console.log(
    "\n❌ No solution found where all products meet minimum addiction level of 50%"
  );
}
