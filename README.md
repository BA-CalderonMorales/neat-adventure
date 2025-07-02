# Neat Adventure

A modern SvelteKit project scaffold following Test-Driven Development principles and best practices.

## Tech Stack

- **Framework**: Svelte 5 with SvelteKit
- **Language**: TypeScript (strict mode)
- **UI Components**: shadcn-svelte
- **Styling**: Tailwind CSS
- **Icons**: Lucide Svelte
- **Testing**: Vitest + Svelte Testing Library
- **Code Quality**: ESLint + Prettier
- **Schema Validation**: Zod

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run type checking
npm run check

# Build for production
npm run build
```

## Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   ├── stores/         # Svelte stores for state management
│   ├── schemas/        # Zod schemas and types
│   ├── adapters/       # External service adapters
│   ├── helpers/        # Utility functions
│   └── utils.ts        # Common utilities
├── features/           # Feature-specific modules
├── routes/             # SvelteKit routes
└── test/               # Test setup and utilities
```

## Development Guidelines

This project follows strict Test-Driven Development (TDD) practices:

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve code while keeping tests green

See `MEMORY.md` for detailed development guidelines and architectural principles.
