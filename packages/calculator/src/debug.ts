/**
 * Debug script to test specific mixing combinations and find correct costs
 */

import { Mixer } from "./engine/mixer.js";
import type { SubstanceName } from "./types/index.js";

function debugCosts() {
  console.log("🔍 Analyzing substance costs from website data");
  console.log("==============================================\n");

  // Expected: Total cost $13 for Cuke + Viagra + Mega Bean
  // Let's reverse engineer the costs

  console.log("Website price data:");
  console.log("- Cuke: Weed ~$43");
  console.log("- Viagra: Weed ~$51");
  console.log("- Mega Bean: Weed ~$48");
  console.log("- Base Weed: $35\n");

  console.log("My calculated costs (price - base):");
  console.log("- Cuke: $43 - $35 = $8");
  console.log("- Viagra: $51 - $35 = $16");
  console.log("- Mega Bean: $48 - $35 = $13");
  console.log("- Total: $8 + $16 + $13 = $37\n");

  console.log("Expected costs (to get $13 total):");
  console.log("- Need to find individual costs that sum to $13");
  console.log("- Maybe the website prices include multiple effects?");
  console.log("- Or maybe costs are calculated differently?\n");

  // Let's try different cost interpretations
  console.log("Possible cost interpretations:");

  // Theory 1: Costs are much lower
  const theory1 = {
    cuke: 3,
    viagra: 5,
    megaBean: 5,
  };
  console.log(
    `Theory 1 - Lower costs: Cuke $${theory1.cuke}, Viagra $${
      theory1.viagra
    }, Mega Bean $${theory1.megaBean} = $${
      theory1.cuke + theory1.viagra + theory1.megaBean
    }`
  );

  // Theory 2: Equal distribution
  const theory2 = {
    cuke: 4.33,
    viagra: 4.33,
    megaBean: 4.34,
  };
  console.log(
    `Theory 2 - Equal split: ~$4.33 each = $${(
      theory2.cuke +
      theory2.viagra +
      theory2.megaBean
    ).toFixed(2)}`
  );

  console.log(
    "\n🤔 Need to understand how substance costs are actually calculated..."
  );
}

function debugMix() {
  const mixer = new Mixer();

  console.log("\n🔍 Current mixing results:");
  console.log("==========================\n");

  let state = mixer.createInitialState("OG Kush");
  console.log(
    `Start: ${Array.from(state.effects).join(
      ", "
    )} - Value: $${state.currentValue.toFixed(2)}`
  );

  state = mixer.applySubstance(state, "Cuke");
  console.log(
    `+Cuke: ${Array.from(state.effects).join(
      ", "
    )} - Value: $${state.currentValue.toFixed(
      2
    )}, Cost: $${state.totalCost.toFixed(2)}`
  );

  state = mixer.applySubstance(state, "Viagra");
  console.log(
    `+Viagra: ${Array.from(state.effects).join(
      ", "
    )} - Value: $${state.currentValue.toFixed(
      2
    )}, Cost: $${state.totalCost.toFixed(2)}`
  );

  state = mixer.applySubstance(state, "Mega Bean");
  console.log(
    `+Mega Bean: ${Array.from(state.effects).join(
      ", "
    )} - Value: $${state.currentValue.toFixed(
      2
    )}, Cost: $${state.totalCost.toFixed(2)}`
  );

  const profit = mixer.calculateProfit(state);
  const profitMargin =
    state.currentValue > 0 ? (profit / state.currentValue) * 100 : 0;

  console.log("\nFinal Results:");
  console.log(`- Sell Price: $${state.currentValue.toFixed(2)}`);
  console.log(`- Total Cost: $${state.totalCost.toFixed(2)}`);
  console.log(`- Profit: $${profit.toFixed(2)}`);
  console.log(`- Profit Margin: ${profitMargin.toFixed(2)}%`);

  console.log("\nExpected:");
  console.log("- Sell Price: $100");
  console.log("- Total Cost: $13");
  console.log("- Profit: $87");
  console.log("- Profit Margin: 87%");
}

debugCosts();
debugMix();
