/**
 * Products data for Schedule 1 game
 * Based on the official calculator data from schedule1-calculator.com
 */

import type { Product, ProductName } from "../types/index.js";

export const PRODUCTS: Record<ProductName, Product> = {
  "OG Kush": {
    name: "OG Kush",
    basePrice: 35,
    initialEffects: ["Calming"],
    category: "weed",
  },
  "Sour Diesel": {
    name: "Sour Diesel",
    basePrice: 35,
    initialEffects: ["Refreshing"],
    category: "weed",
  },
  "Green Crack": {
    name: "Green Crack",
    basePrice: 35,
    initialEffects: ["Focused"],
    category: "weed",
  },
  "Grandaddy Purple": {
    name: "Grandaddy Purple",
    basePrice: 35,
    initialEffects: ["Sedating"],
    category: "weed",
  },
  Meth: {
    name: "Meth",
    basePrice: 70,
    initialEffects: [],
    category: "stimulant",
  },
  Cocaine: {
    name: "Cocaine",
    basePrice: 150,
    initialEffects: [],
    category: "stimulant",
  },
};

export const getProduct = (name: ProductName): Product | undefined => {
  return PRODUCTS[name];
};

export const getAllProducts = (): ProductName[] => {
  return Object.keys(PRODUCTS) as ProductName[];
};

export const getProductsByCategory = (
  category: "weed" | "stimulant"
): ProductName[] => {
  return Object.entries(PRODUCTS)
    .filter(([_, product]) => product.category === category)
    .map(([name, _]) => name as ProductName);
};

export const getProductBasePrice = (name: ProductName): number => {
  const product = getProduct(name);
  return product?.basePrice ?? 0;
};
