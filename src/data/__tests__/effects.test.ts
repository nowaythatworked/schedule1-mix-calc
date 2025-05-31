import { describe, test, expect } from "vitest";
import { getEffect, getAllEffects, EFFECTS } from "../effects.js";
import type { EffectName } from "../../types/index.js";

describe("Effects Data", () => {
  test("should have all 34 effects defined", () => {
    const effectNames = getAllEffects();
    expect(effectNames).toHaveLength(34);
  });

  test("should return correct effect data for Anti-Gravity", () => {
    const effect = getEffect("Anti-Gravity");
    expect(effect).toEqual({
      name: "Anti-Gravity",
      multiplier: 0.54,
      addiction: 0.611,
    });
  });

  test("should return correct effect data for effects with 0.00 multiplier", () => {
    const disorienting = getEffect("Disorienting");
    expect(disorienting).toEqual({
      name: "Disorienting",
      multiplier: 0.0,
      addiction: 0,
    });

    const explosive = getEffect("Explosive");
    expect(explosive).toEqual({
      name: "Explosive",
      multiplier: 0.0,
      addiction: 0,
    });
  });

  test("should return correct effect data for highest multiplier effect", () => {
    const shrinking = getEffect("Shrinking");
    expect(shrinking).toEqual({
      name: "Shrinking",
      multiplier: 0.6,
      addiction: 0.336,
    });
  });

  test("should return undefined for non-existent effect", () => {
    const effect = getEffect("Non-Existent" as EffectName);
    expect(effect).toBeUndefined();
  });

  test("should have correct multipliers for sample effects", () => {
    expect(getEffect("Zombifying")?.multiplier).toBe(0.58);
    expect(getEffect("Cyclopean")?.multiplier).toBe(0.56);
    expect(getEffect("Long Faced")?.multiplier).toBe(0.52);
    expect(getEffect("Electrifying")?.multiplier).toBe(0.5);
    expect(getEffect("Glowing")?.multiplier).toBe(0.48);
  });

  test("should have all effects in EFFECTS object", () => {
    const expectedEffects: EffectName[] = [
      "Anti-Gravity",
      "Athletic",
      "Balding",
      "Bright-Eyed",
      "Calming",
      "Calorie-Dense",
      "Cyclopean",
      "Disorienting",
      "Electrifying",
      "Energizing",
      "Euphoric",
      "Explosive",
      "Focused",
      "Foggy",
      "Gingeritis",
      "Glowing",
      "Jennerising",
      "Laxative",
      "Long Faced",
      "Munchies",
      "Paranoia",
      "Refreshing",
      "Schizophrenia",
      "Sedating",
      "Seizure-Inducing",
      "Shrinking",
      "Slippery",
      "Smelly",
      "Sneaky",
      "Spicy",
      "Thought-Provoking",
      "Toxic",
      "Tropic Thunder",
      "Zombifying",
    ];

    expectedEffects.forEach((effectName) => {
      expect(EFFECTS[effectName]).toBeDefined();
      expect(EFFECTS[effectName]?.name).toBe(effectName);
      expect(typeof EFFECTS[effectName]?.multiplier).toBe("number");
    });
  });
});
