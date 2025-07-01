# Development Guidelines for All LLMs/agents

This document outlines the core development philosophy and practices for this project. Adherence to these guidelines is mandatory to ensure code quality, consistency, and maintainability.

## Table of Contents

- [Core Philosophy](#core-philosophy)
  - [Quick Reference](#quick-reference)
- [The TDD Workflow](#the-tdd-workflow)
  - [The Red-Green-Refactor Cycle](#the-red-green-refactor-cycle)
  - [Refactoring: The Critical Third Step](#refactoring---the-critical-third-step)
- [Coding Principles](#coding-principles)
  - [SOLID Principles](#solid-principles)
  - [Simplicity and Pragmatism (KISS & YAGNI)](#simplicity-and-pragmatism-kiss--yagni)
  - [Code Reuse (DRY)](#code-reuse-dry)
  - [TypeScript Guidelines](#typescript-guidelines)
  - [Code Style](#code-style)
  - [Error Handling](#error-handling)
- [Architectural Principles](#architectural-principles)
  - [Feature-Driven Structure](#feature-driven-structure)
  - [Ports & Adapters](#ports--adapters)
  - [Separation of Concerns](#separation-of-concerns)
- [Testing Principles](#testing-principles)
  - [Behavior-Driven Testing](#behavior-driven-testing)
  - [Testing Tools & Organization](#testing-tools--organization)
  - [Test Data Patterns](#test-data-patterns)
- [Collaboration & Process](#collaboration--process)
  - [Commit & Pull Request Standards](#commit--pull-request-standards)
  - [Documentation and Knowledge Sharing](#documentation-and-knowledge-sharing)
  - [Working with Claude](#working-with-claude)
- [Performance & Observability](#performance--observability)
- [Reference](#reference)
  - [Common Patterns to Avoid](#common-patterns-to-avoid)
  - [Resources](#resources)
  - [Hosting Environments](#hosting-environments)

## Core Philosophy

**TEST-DRIVEN DEVELOPMENT IS NON-NEGOTIABLE.** Every single line of production code must be written in response to a failing test. No exceptions. This is not a suggestion or a preference - it is the fundamental practice that enables all other principles in this document.

This project is built exclusively with **Svelte and SvelteKit**. All frontend development, components, and testing practices must align with the Svelte ecosystem. This project's development is guided by established software engineering principles including SOLID, KISS, YAGNI, and DRY, which are detailed below.

### Quick Reference

**Key Principles:**

- Write tests first (TDD)
- Test behavior, not implementation
- No `any` types or type assertions
- Immutable data only
- Small, pure functions
- TypeScript strict mode always
- Use real schemas/types in tests, never redefine them

**Preferred Tools:**

- **Language**: TypeScript (strict mode)
- **Testing**: Jest/Vitest + Svelte Testing Library
- **State Management**: Prefer immutable patterns

## The TDD Workflow

### The Red-Green-Refactor Cycle

**CRITICAL**: TDD is not optional. Every feature, every bug fix, every change MUST follow this process:

Follow Red-Green-Refactor strictly:

1.  **Red**: Write a failing test for the desired behavior. NO PRODUCTION CODE until you have a failing test.
2.  **Green**: Write the MINIMUM code to make the test pass. Resist the urge to write more than needed.
3.  **Refactor**: Assess the code for improvement opportunities. If refactoring would add value, clean up the code while keeping tests green. If the code is already clean and expressive, move on.

**Common TDD Violations to Avoid:**

- Writing production code without a failing test first
- Writing multiple tests before making the first one pass
- Writing more production code than needed to pass the current test
- Skipping the refactor assessment step when code could be improved
- Adding functionality "while you're there" without a test driving it

**Remember**: If you're typing production code and there isn't a failing test demanding that code, you're not doing TDD.

#### TDD Example Workflow

```typescript
// Step 1: Red - Start with the simplest behavior
describe("Order processing", () => {
  it("should calculate total with shipping cost", () => {
    const order = createOrder({
      items: [{ price: 30, quantity: 1 }],
      shippingCost: 5.99,
    });

    const processed = processOrder(order);

    expect(processed.total).toBe(35.99);
    expect(processed.shippingCost).toBe(5.99);
  });
});

// Step 2: Green - Minimal implementation
const processOrder = (order: Order): ProcessedOrder => {
  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    ...order,
    shippingCost: order.shippingCost,
    total: itemsTotal + order.shippingCost,
  };
};

// Step 3: Red - Add test for free shipping behavior
describe("Order processing", () => {
  it("should calculate total with shipping cost", () => {
    // ... existing test
  });

  it("should apply free shipping for orders over \u00a350", () => {
    const order = createOrder({
      items: [{ price: 60, quantity: 1 }],
      shippingCost: 5.99,
    });

    const processed = processOrder(order);

    expect(processed.shippingCost).toBe(0);
    expect(processed.total).toBe(60);
  });
});

// Step 4: Green - NOW we can add the conditional because both paths are tested
const processOrder = (order: Order): ProcessedOrder => {
  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingCost = itemsTotal > 50 ? 0 : order.shippingCost;

  return {
    ...order,
    shippingCost,
    total: itemsTotal + shippingCost,
  };
};

// Step 5: Add edge case tests to ensure 100% behavior coverage
describe("Order processing", () => {
  // ... existing tests

  it("should charge shipping for orders exactly at \u00a350", () => {
    const order = createOrder({
      items: [{ price: 50, quantity: 1 }],
      shippingCost: 5.99,
    });

    const processed = processOrder(order);

    expect(processed.shippingCost).toBe(5.99);
    expect(processed.total).toBe(55.99);
  });
});

// Step 6: Refactor - Extract constants and improve readability
const FREE_SHIPPING_THRESHOLD = 50;

const calculateItemsTotal = (items: OrderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const qualifiesForFreeShipping = (itemsTotal: number): boolean => {
  return itemsTotal > FREE_SHIPPING_THRESHOLD;
};

const processOrder = (order: Order): ProcessedOrder => {
  const itemsTotal = calculateItemsTotal(order.items);
  const shippingCost = qualifiesForFreeShipping(itemsTotal)
    ? 0
    : order.shippingCost;

  return {
    ...order,
    shippingCost,
    total: itemsTotal + shippingCost,
  };
};
```

### Refactoring - The Critical Third Step

Evaluating refactoring opportunities is not optional - it's the third step in the TDD cycle. After achieving a green state and committing your work, you MUST assess whether the code can be improved. However, only refactor if there's clear value - if the code is already clean and expresses intent well, move on to the next test.

#### What is Refactoring?

Refactoring means changing the internal structure of code without changing its external behavior. The public API remains unchanged, all tests continue to pass, but the code becomes cleaner, more maintainable, or more efficient. Remember: only refactor when it genuinely improves the code - not all code needs refactoring.

#### When to Refactor

- **Always assess after green**: Once tests pass, before moving to the next test, evaluate if refactoring would add value
- **When you see duplication**: But understand what duplication really means (see DRY below)
- **When names could be clearer**: Variable names, function names, or type names that don't clearly express intent
- **When structure could be simpler**: Complex conditional logic, deeply nested code, or long functions
- **When patterns emerge**: After implementing several similar features, useful abstractions may become apparent

**Remember**: Not all code needs refactoring. If the code is already clean, expressive, and well-structured, commit and move on.

#### Refactoring Guidelines

##### 1. Commit Before Refactoring

Always commit your working code before starting any refactoring. This gives you a safe point to return to:

```bash
git add .
git commit -m "feat: add payment validation"
# Now safe to refactor
```

##### 2. Look for Useful Abstractions Based on Semantic Meaning

Create abstractions only when code shares the same semantic meaning and purpose. Don't abstract based on structural similarity alone - **duplicate code is far cheaper than the wrong abstraction**.

##### 3. Understanding DRY - It's About Knowledge, Not Code

DRY (Don't Repeat Yourself) is about not duplicating **knowledge** in the system, not about eliminating all code that looks similar.

##### 4. Maintain External APIs During Refactoring

Refactoring must never break existing consumers of your code.

##### 5. Verify and Commit After Refactoring

**CRITICAL**: After every refactoring:

1. Run all tests - they must pass without modification
2. Run static analysis (linting, type checking) - must pass
3. Commit the refactoring separately from feature changes

```bash
# After refactoring
npm test          # All tests must pass
npm run lint      # All linting must pass
npm run typecheck # TypeScript must be happy

# Only then commit
git add .
git commit -m "refactor: extract payment validation helpers"
```

## Coding Principles

In addition to the TDD workflow, all code must adhere to the following principles to ensure it is robust, maintainable, and easy to understand.

### SOLID Principles
- **Single Responsibility:** Each Svelte component, store, and endpoint must do one thing and do it well.
- **Open/Closed:** Design modules (especially stores and adapters) so they can be extended with new functionality without modifying their existing source code.
- **Liskov Substitution:** When creating variations of a store or adapter, ensure they are interchangeable and adhere to a common interface.
- **Interface Segregation:** Keep APIs focused and lean. For example, create separate server endpoints for distinct use-cases rather than a single, monolithic endpoint.
- **Dependency Inversion:** Depend on abstractions (interfaces, type contracts) rather than concrete implementations. This is key for decoupling and testability.

### Simplicity and Pragmatism (KISS & YAGNI)
- **Keep It Simple, Stupid (KISS):** Leverage SvelteKit’s built-in features for routing, layouts, and data loading. Avoid creating custom abstractions unless a clear need has been demonstrated and the built-in tools are insufficient.
- **You Aren’t Gonna Need It (YAGNI):** Implement features only when there is a real, immediate need. Avoid speculative generalization or adding functionality for future, unconfirmed use cases.

### Code Reuse (DRY)
- **Don’t Repeat Yourself (DRY):** Centralize business logic, data transformations, and API interactions in the `src/lib/` directory (e.g., stores, helper functions, adapters).
- **Atomic Components:** Build small, single-purpose, reusable UI components. Prefer composing complex UIs from these simple building blocks over cloning and tweaking existing components.
- **Parameterize Patterns:** When a pattern repeats (e.g., form handling logic, Svelte actions, transitions), factor it out into a reusable, parameterized function.

### TypeScript Guidelines

#### Strict Mode Requirements

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

- **No `any`** - ever. Use `unknown` if type is truly unknown
- **No type assertions** (`as SomeType`) unless absolutely necessary with clear justification
- **No `@ts-ignore`** or `@ts-expect-error` without explicit explanation
- These rules apply to test code as well as production code

#### Type Definitions & Schema-First Development

- **Prefer `type` over `interface`** in all cases.
- Use Zod or any other [Standard Schema](https://standardschema.dev/) compliant schema library to create types, by creating schemas first.
- Always define your schemas first, then derive types from them.

```typescript
import { z } from "zod";

// Define schemas first - these provide runtime validation
const AddressDetailsSchema = z.object({
  houseNumber: z.string(),
  addressLine1: z.string().min(1),
  city: z.string().min(1),
});

// Derive types from schemas
type AddressDetails = z.infer<typeof AddressDetailsSchema>;

// Use schemas at runtime boundaries
export const parseAddress = (data: unknown): AddressDetails => {
  return AddressDetailsSchema.parse(data);
};
```

#### Schema Usage in Tests

**CRITICAL**: Tests must use real schemas and types from the main project, not redefine their own. This ensures consistency and maintainability.

### Code Style

#### Functional Programming

I follow a "functional light" approach:

- **No data mutation** - work with immutable data structures
- **Pure functions** wherever possible
- **Composition** as the primary mechanism for code reuse
- Use array methods (`map`, `filter`, `reduce`) over imperative loops

#### Code Structure

- **No nested if/else statements** - use early returns, guard clauses, or composition
- **Avoid deep nesting** in general (max 2 levels)
- Keep functions small and focused on a single responsibility

#### Naming Conventions

- **Functions**: `camelCase`, verb-based (e.g., `calculateTotal`, `validatePayment`)
- **Types**: `PascalCase` (e.g., `PaymentRequest`, `UserProfile`)
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: `kebab-case.ts`

#### No Comments in Code

Code should be self-documenting through clear naming and structure. Comments indicate that the code itself is not clear enough.

#### Prefer Options Objects

Use options objects for function parameters as the default pattern, especially for functions with multiple or optional parameters.

```typescript
// Good: Options object with clear property names
type CreatePaymentOptions = {
  amount: number;
  currency: string;
  customerId: string;
  idempotencyKey?: string;
};

const createPayment = (options: CreatePaymentOptions): Payment => {
  // implementation
};

// Clear and readable at call site
const payment = createPayment({
  amount: 100,
  currency: "GBP",
  customerId: "cust_456",
});
```

### Error Handling

Use Result types or early returns with exceptions for handling errors. Avoid `try/catch` blocks unless necessary for a specific reason.

```typescript
// Good - Result type pattern
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

const processPayment = (payment: Payment): Result<ProcessedPayment, PaymentError> => {
  if (!isValidPayment(payment)) {
    return { success: false, error: new PaymentError("Invalid payment") };
  }
  return { success: true, data: executePayment(payment) };
};

// Also good - early returns with exceptions
const processPaymentWithException = (payment: Payment): ProcessedPayment => {
  if (!isValidPayment(payment)) {
    throw new PaymentError("Invalid payment");
  }
  return executePayment(payment);
};
```

## Architectural Principles

To maintain a clean and scalable codebase, we adhere to a clear architectural model that emphasizes boundaries and separation of concerns.

### Feature-Driven Structure
Organize the codebase into feature modules. Each feature should be a self-contained unit located at `src/features/<feature-name>`, containing its own components, stores, tests, and documentation. This approach improves discoverability and reduces coupling between different parts of the application.

### Ports & Adapters (Hexagonal Architecture)
Isolate the application's core logic from external concerns like APIs, databases, or third-party services.
- **Ports:** Define contracts (TypeScript interfaces/types) for how the application interacts with the outside world.
- **Adapters:** Implement the ports. This allows for swapping implementations (e.g., from a mock API to a real REST API) without changing any core application code.

### Separation of Concerns
Maintain a strict separation between different layers of the application:
- **UI (Svelte Components):** Responsible for presentation and user interaction only.
- **State (Svelte Stores):** Manages application state and business logic.
- **Side Effects (Endpoints, Adapters):** Handle all communication with the outside world.

## Testing Principles

### Behavior-Driven Testing

- **No "unit tests"** - this term is not helpful. Tests should verify expected behavior, treating implementation as a black box.
- Test through the public API exclusively.
- Tests must document expected business behaviour.
- 100% coverage should be expected, and must be achieved by testing business behaviour, not implementation details.

### Testing Tools & Organization

- **Frameworks**: Jest or Vitest
- **Svelte Components**: Svelte Testing Library
- **API Mocking**: MSW (Mock Service Worker)
- **Organization**: Group tests by feature. A test file can cover multiple implementation files within that feature.

### Test Data Patterns

Use factory functions with optional overrides for test data to create consistent and complete mock objects.

```typescript
const getMockPaymentRequest = (
  overrides?: Partial<PostPaymentsRequestV3>
): PostPaymentsRequestV3 => {
  return {
    CardAccountId: "1234567890123456",
    Amount: 100,
    Source: "Web",
    // ... other sensible defaults
    ...overrides,
  };
};
```

## Collaboration & Process

### Commit & Pull Request Standards

- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format (`feat:`, `fix:`, `refactor:`, etc.).
- **Pull Requests**: Should be small, focused, and have all tests passing.

### Documentation and Knowledge Sharing
- **Architectural Decision Records (ADRs):** For any significant architectural choice (e.g., selecting a library, designing a core data flow), create a new ADR in the `docs/ADRs/` directory. This documents the "why" behind our decisions for future reference.
- **Per-Feature READMEs:** Each feature module in `src/features/` should include a `README.md` file that outlines its contract, data flow, and any performance considerations.
- **Code Reviews & Pairing:** Actively use code reviews and pair programming to enforce standards, share knowledge, and maintain a high-quality codebase. The goal is to leave the code better than you found it.

### Working with Claude

- **ALWAYS FOLLOW TDD**: No production code without a failing test. This is not negotiable.
- **Think deeply** and **ask clarifying questions**.
- **Keep changes small** and incremental.
- **Start with a failing test** for any code change.
- After making tests pass, **always assess refactoring opportunities**.

## Performance & Observability
- **Targeted Optimization:** Leverage SvelteKit's server-side rendering (SSR) and selective hydration. Optimize performance hotspots based on real user metrics and telemetry data, not on gut feelings.
- **Built-in Telemetry:** Instrument key server endpoints and UI events to gather performance and usage data. This provides the necessary insights to make informed decisions about optimization.

## Reference

### Common Patterns to Avoid

- **Mutation**: Prefer immutable updates (e.g., `[...array, newItem]` instead of `array.push()`).
- **Nested Conditionals**: Prefer early returns or guard clauses.
- **Large Functions**: Decompose into smaller, single-purpose functions.

### Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles)

### Hosting Environments
We have two environments for this project: one deployed via GitHub Pages and another using lovable.app. Do not modify configuration files for these setups unless absolutely necessary.
