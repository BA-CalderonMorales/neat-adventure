# Tech Stack & Library Rules

This project is built with a modern, robust tech stack. Please adhere to these choices to maintain consistency.

### Tech Stack

*   **Framework:** Svelte with SvelteKit for a fast and efficient development experience.
*   **Language:** TypeScript for strong typing and improved code quality.
*   **UI Components:** shadcn-svelte provides a set of reusable, accessible, and stylable components.
*   **Styling:** Tailwind CSS is used for all styling via utility classes.
*   **Icons:** Lucide Svelte for a clean and consistent set of icons.
*   **Routing:** SvelteKit's built-in file-based routing.
*   **Code Quality:** ESLint and Prettier are configured to enforce a consistent code style.

### Library Usage

*   **UI Development:** Always prefer using components from the `shadcn-svelte` library for building the interface.
*   **Custom Components:** If a required component doesn't exist in `shadcn-svelte`, create a new, single-purpose Svelte component inside `src/lib/components`.
*   **Styling:** Do not write custom CSS. All styling must be implemented using Tailwind CSS utility classes.
*   **Icons:** Only use icons from the `lucide-svelte` package.
*   **State Management:** Use Svelte's built-in stores for managing state.
*   **Routing:** Define all application routes within the `src/routes` directory using SvelteKit's file-based routing conventions.

### Project Structure & Documentation
*   **Feature Modules:** Group related components, stores, tests, and documentation under `src/features/<feature>`.
*   **Shared Logic:** Place reusable logic (stores, helpers, adapters) in the `src/lib/` directory.
*   **Architectural Decisions:** Record significant architectural choices in `docs/ADRs/`.

---

# Repository Workflow Rules

These rules keep development consistent across the project. The document is intentionally brief so it can be referenced often.

## General Principles

- Follow Test-Driven Development. Write tests before production code and keep changes small.
- Use strict TypeScript and prefer immutable patterns.
- Adhere to the architectural principles outlined in **MEMORY.md**.
- When looking for solutions, consult **context7** and the guidance in **MEMORY.md**. Do not copy text from MEMORY.md into this file.
- Avoid modifying core SvelteKit configuration files (e.g., `svelte.config.js`) or deployment settings unless absolutely necessary to keep the live sites accessible.

## Local Workflow

Use these npm scripts during feature work:

- `npm install` – install dependencies
- `npm run dev` – run the development server
- `npm run check` – run TypeScript checks
- `npm run test` – run the full test suite
- `npm run build` – build for production

Run `npm install`, `npm run check`, `npm run test`, and `npm run build` before pushing changes. CI uses the same commands.

## Commit Standards

Commits must use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Examples:

```
feat: add dark mode toggle
fix: handle null todo values
chore: update dependencies
```

## Pull Requests

Prefix PR titles to show intent:

- **Feature:** … → merge into `develop`
- **Bugfix:** … → merge into `develop`
- **Cleanup:** … → merge into `develop`
- **Pipeline:** … → merge into `develop`
- **Hotfix:** … → merge directly to `main`

Include a **Codex CI** section summarising `install`, `build`, `typecheck`, and `test` results.

After merging into `develop`, automatically open a PR that merges `develop` into `main` so changes can be tested against the main branch.

## Continuous Integration

All dependencies must be installed with `npm ci` in CI jobs. The Super-Linter runs on every pull request via `.github/workflows/super-linter.yml`.
