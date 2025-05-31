import { describe, test, expect, beforeEach } from "vitest";
import { Mixer } from "../mixer.js";
import type {
  EffectName,
  SubstanceName,
  IngredientName,
} from "../../types/index.js";

describe("Mixer", () => {
  let mixer: Mixer;

  beforeEach(() => {
    mixer = new Mixer();
  });

  test("should create initial mix state from substance", () => {
    const state = mixer.createInitialState("OG Kush");

    expect(state.baseSubstance).toBe("OG Kush");
    expect(state.effects).toEqual(new Set(["Calming"]));
    expect(state.ingredientsUsed).toEqual([]);
    expect(state.totalCost).toBe(0);
  });

  test("should apply ingredient to mix state", () => {
    const initialState = mixer.createInitialState("OG Kush");
    const newState = mixer.applyIngredient(initialState, "Cuke");

    expect(newState.ingredientsUsed).toEqual(["Cuke"]);
    expect(newState.totalCost).toBe(2); // Cuke costs 2 (GameSpot guide)
    expect(newState.effects.has("Energizing")).toBe(true); // Cuke's default effect
  });

  test("should apply transformation rules correctly", () => {
    // Start with OG Kush (has Calming effect) and apply Banana
    // Banana transforms Calming to Sneaky according to transformation rules
    const initialState = mixer.createInitialState("OG Kush"); // OG Kush has Calming
    const newState = mixer.applySubstance(initialState, "Banana");

    expect(newState.effects.has("Calming")).toBe(false);
    expect(newState.effects.has("Sneaky")).toBe(true);
    expect(newState.effects.has("Gingeritis")).toBe(true); // Banana's default effect
  });

  test("should not exceed 8 effects limit", () => {
    let state = mixer.createInitialState("OG Kush");

    // Add substances to reach effect limit
    const substances: SubstanceName[] = [
      "Cuke",
      "Flu Medicine",
      "Donut",
      "Energy Drink",
      "Mouth Wash",
      "Motor Oil",
      "Banana",
      "Chili",
    ];

    substances.forEach((substance) => {
      state = mixer.applySubstance(state, substance);
    });

    expect(state.effects.size).toBeLessThanOrEqual(8);
  });

  test("should calculate current value correctly", () => {
    const state = mixer.createInitialState("OG Kush");
    const value = mixer.calculateCurrentValue(state);

    // OG Kush base price (35) + Calming effect (0.10 multiplier)
    // Final price = 35 * (1 + 0.10) = 38.5
    expect(value).toBe(38.5);
  });

  test("should calculate profit correctly", () => {
    const initialState = mixer.createInitialState("OG Kush");
    const stateAfterCuke = mixer.applySubstance(initialState, "Cuke");

    const profit = mixer.calculateProfit(stateAfterCuke);

    // Calculate expected profit
    const currentValue = mixer.calculateCurrentValue(stateAfterCuke);
    const expectedProfit = currentValue - stateAfterCuke.totalCost;

    expect(profit).toBe(expectedProfit);
  });

  test("should handle multiple ingredient applications", () => {
    let state = mixer.createInitialState("OG Kush");

    state = mixer.applyIngredient(state, "Cuke");
    state = mixer.applyIngredient(state, "Flu Medicine");

    expect(state.ingredientsUsed).toEqual(["Cuke", "Flu Medicine"]);
    expect(state.totalCost).toBe(7); // 2 + 5 (GameSpot guide costs)
    expect(state.effects.size).toBeGreaterThan(1);
  });

  test("should create valid mix sequence", () => {
    const sequence: IngredientName[] = ["Cuke", "Flu Medicine", "Donut"];
    const finalState = mixer.applySequence("OG Kush", sequence);

    expect(finalState.baseSubstance).toBe("OG Kush");
    expect(finalState.ingredientsUsed).toEqual(sequence);
    expect(finalState.totalCost).toBe(10); // 2 + 5 + 3 (GameSpot guide costs)
  });
});
