# Schedule 1 Optimal Mixing Calculator

A sophisticated TypeScript-based optimization engine for the Schedule 1 game that finds optimal substance mixing sequences to maximize profit.

## 🎯 Features

- **Optimal Mix Finding**: Uses hybrid Dynamic Programming + Branch & Bound algorithm
- **Multiple Constraints**: Budget limits, substance availability, step count limits
- **Complex Rule Engine**: Handles all 16 substances with their transformation rules
- **Performance Optimized**: Memoization and pruning for efficient computation
- **Type-Safe**: Full TypeScript implementation with comprehensive type definitions
- **Test-Driven**: 40+ tests ensuring reliability and correctness

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run the full demo
npm start

# Or run simple examples
npm run build && node quick-calc.js              # Quick JavaScript version
npm run build && node dist/simple-calculator.js  # TypeScript version

# Run tests
npm test
```

## 📊 Example Results

```
🧪 Schedule 1 Optimal Mixing Calculator

Example 1: OG Kush with 3 mixing steps
=== OPTIMIZATION RESULT ===
Base Product: OG Kush
Mixing Sequence: Gasoline → Mouth Wash → Paracetamol
Final Effects: Anti-Gravity, Balding, Tropic Thunder, Sneaky
Total Cost: $19.00
Sell Price: $88.90
Profit: $69.90
Profit Margin: 78.63%
```

## 🏗️ Architecture

### Core Components

1. **Data Layer** (`src/data/`)

   - `effects.ts`: 34 effects with multipliers (0.00 to 0.60)
   - `products.ts`: 6 base products (weed variants, meth, cocaine)
   - `substances.ts`: 16 substances with costs and transformation rules

2. **Engine Layer** (`src/engine/`)

   - `mixer.ts`: Core mixing logic and state management
   - Handles effect transformations and 8-effect limit

3. **Optimization Layer** (`src/optimization/`)
   - `optimizer.ts`: Hybrid DP + Branch & Bound algorithm
   - Memoization for state caching
   - Pruning for performance optimization

### Algorithm Details

The optimizer uses a **Hybrid Dynamic Programming + Branch and Bound** approach:

- **Dynamic Programming**: Caches identical effect states to avoid recomputation
- **Branch and Bound**: Prunes unprofitable branches using optimistic profit estimates
- **State Compression**: Uses sorted effect arrays for consistent cache keys
- **Heuristic Pruning**: Estimates maximum possible profit for early termination

## 🧪 Game Mechanics

### Pricing Formula

```
Final Price = Base Price × (1 + total effect multiplier)
Profit = Final Price - Substance Costs
```

### Base Prices

- **Weed products**: $35 (OG Kush, Sour Diesel, Green Crack, Grandaddy Purple)
- **Meth**: $70
- **Cocaine**: $150

### Effect System

- Maximum 8 effects per mix
- 34 different effects with varying multipliers
- Transformation rules: substances can replace existing effects

### Substances

16 substances with costs ranging from $0 (Gasoline) to $18 (Horse Semen), each with:

- Default effect added to mix
- 4-11 transformation rules (IF condition THEN replacement)

## 📈 Performance

The algorithm efficiently handles:

- **1-3 steps**: Sub-millisecond optimization
- **4-5 steps**: 5-15ms optimization
- **6+ steps**: Scales with pruning optimizations

Performance scales exponentially with steps but remains practical for typical use cases.

## 🔧 API Usage

```typescript
import { Optimizer } from "./optimization/optimizer.js";
import type { OptimizationOptions } from "./types/index.js";

const optimizer = new Optimizer();

const options: OptimizationOptions = {
  baseProduct: "OG Kush",
  maxSteps: 3,
  budgetLimit: 25,
  availableSubstances: ["Cuke", "Banana", "Chili"],
};

const result = optimizer.findOptimalMix(options);
console.log(`Optimal profit: $${result.profit.toFixed(2)}`);
```

## 🧪 Testing

Comprehensive test suite with 40+ tests covering:

```bash
# Run all tests
npm test

# Run specific test files
npm test -- src/data/__tests__/effects.test.ts
npm test -- src/engine/__tests__/mixer.test.ts
npm test -- src/optimization/__tests__/optimizer.test.ts

# Watch mode for development
npm run test:watch
```

## 📁 Project Structure

```
src/
├── data/                    # Game data and constants
│   ├── effects.ts          # Effect definitions and multipliers
│   ├── products.ts         # Base product data
│   ├── substances.ts       # Substance costs and rules
│   └── __tests__/          # Data layer tests
├── engine/                 # Core mixing logic
│   ├── mixer.ts           # Mixing engine implementation
│   └── __tests__/         # Engine tests
├── optimization/          # Optimization algorithms
│   ├── optimizer.ts       # Main optimization engine
│   └── __tests__/         # Optimization tests
├── types/                 # TypeScript type definitions
│   └── index.ts          # Core type definitions
└── main.ts               # Demo application
```

## 🎮 Game Data Source

All data is based on the official [Schedule 1 Calculator](https://schedule1-calculator.com/howitworks) which provides:

- Complete effect multipliers
- Substance transformation rules
- Pricing formulas
- Game mechanics documentation

## 🚀 Future Enhancements

- **Parallel Processing**: Worker threads for large search spaces
- **Advanced Heuristics**: Machine learning for better profit estimation
- **Interactive CLI**: Command-line interface for custom optimization
- **Web Interface**: Browser-based calculator with visualization
- **Batch Optimization**: Multiple product optimization simultaneously

## 📄 License

ISC License - Feel free to use and modify for your Schedule 1 optimization needs!

---

_Built with TypeScript, Vitest, and optimization algorithms for the Schedule 1 gaming community._
