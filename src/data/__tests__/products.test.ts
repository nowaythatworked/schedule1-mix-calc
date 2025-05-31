import { describe, test, expect } from "vitest";
import {
  getProduct,
  getAllProducts,
  getProductsByCategory,
  PRODUCTS,
} from "../products.js";
import type { ProductName } from "../../types/index.js";

describe("Products Data", () => {
  test("should have all 6 products defined", () => {
    const productNames = getAllProducts();
    expect(productNames).toHaveLength(6);
  });

  test("should return correct product data for OG Kush", () => {
    const product = getProduct("OG Kush");
    expect(product).toEqual({
      name: "OG Kush",
      basePrice: 35,
      initialEffects: ["Calming"],
      category: "weed",
    });
  });

  test("should return correct product data for Meth", () => {
    const product = getProduct("Meth");
    expect(product).toEqual({
      name: "Meth",
      basePrice: 70,
      initialEffects: [],
      category: "stimulant",
    });
  });

  test("should return correct product data for Cocaine", () => {
    const product = getProduct("Cocaine");
    expect(product).toEqual({
      name: "Cocaine",
      basePrice: 150,
      initialEffects: [],
      category: "stimulant",
    });
  });

  test("should return undefined for non-existent product", () => {
    const product = getProduct("Non-Existent" as ProductName);
    expect(product).toBeUndefined();
  });

  test("should return weed products by category", () => {
    const weedProducts = getProductsByCategory("weed");
    expect(weedProducts).toEqual([
      "OG Kush",
      "Sour Diesel",
      "Green Crack",
      "Grandaddy Purple",
    ]);
  });

  test("should return stimulant products by category", () => {
    const stimulantProducts = getProductsByCategory("stimulant");
    expect(stimulantProducts).toEqual(["Meth", "Cocaine"]);
  });

  test("should have correct base prices", () => {
    expect(getProduct("OG Kush")?.basePrice).toBe(35);
    expect(getProduct("Sour Diesel")?.basePrice).toBe(35);
    expect(getProduct("Green Crack")?.basePrice).toBe(35);
    expect(getProduct("Grandaddy Purple")?.basePrice).toBe(35);
    expect(getProduct("Meth")?.basePrice).toBe(70);
    expect(getProduct("Cocaine")?.basePrice).toBe(150);
  });

  test("should have all products in PRODUCTS object", () => {
    const expectedProducts: ProductName[] = [
      "OG Kush",
      "Sour Diesel",
      "Green Crack",
      "Grandaddy Purple",
      "Meth",
      "Cocaine",
    ];

    expectedProducts.forEach((productName) => {
      expect(PRODUCTS[productName]).toBeDefined();
      expect(PRODUCTS[productName]?.name).toBe(productName);
      expect(typeof PRODUCTS[productName]?.basePrice).toBe("number");
      expect(Array.isArray(PRODUCTS[productName]?.initialEffects)).toBe(true);
      expect(["weed", "stimulant"]).toContain(PRODUCTS[productName]?.category);
    });
  });
});
