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

## Branch Naming Standards

Branch names must follow a consistent pattern to maintain organization and clarity:

**Pattern:** `<type>/<scope>-<description>`

**Types:**
- `feature/` - New functionality or enhancements
- `fix/` - Bug fixes and corrections
- `chore/` - Maintenance, dependencies, tooling
- `docs/` - Documentation updates
- `refactor/` - Code restructuring without behavior changes
- `test/` - Adding or updating tests
- `hotfix/` - Critical fixes for production

**Examples:**
```
feature/user-authentication
fix/button-click-handler
chore/update-dependencies
docs/api-documentation
refactor/component-structure
test/button-component-coverage
hotfix/security-vulnerability
```

**Rules:**
- Use lowercase with hyphens for separation
- Keep descriptions concise but descriptive
- Scope should indicate the area of change (component, feature, etc.)

## Commit Standards

All commits **MUST** follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for semantic versioning compatibility.

**Format:** `<type>[optional scope]: <description>`

**Types (aligned with semantic versioning):**
- `feat:` - New feature (MINOR version bump)
- `fix:` - Bug fix (PATCH version bump)
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring without behavior changes
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates
- `perf:` - Performance improvements
- `ci:` - CI/CD pipeline changes
- `build:` - Build system or external dependency changes

**Breaking Changes:** Add `!` after type or `BREAKING CHANGE:` in footer (MAJOR version bump)

**Examples:**
```
feat(auth): add user login functionality
fix(button): resolve click event handler issue
docs(readme): update installation instructions
style(components): format code with prettier
refactor(utils): extract common helper functions
test(button): add comprehensive variant coverage
chore(deps): update svelte to v5.0.0
perf(api): optimize database queries
feat!: remove deprecated API endpoints
```

**Commit Body Guidelines:**
- Use imperative mood ("add" not "added" or "adds")
- Capitalize first letter of description
- No period at the end of description
- Include detailed explanation in body if needed
- Reference issues/PRs in footer: `Closes #123`

**Git Configuration:**
Set up the commit message template for consistent formatting:
```bash
git config commit.template .gitmessage
```

## Pull Request Standards

PR titles and descriptions must follow a consistent pattern for clarity and automation.

**Title Format:** `<Type>: <Description>`

**Types:**
- **Feature:** New functionality or enhancements → merge into `develop`
- **Fix:** Bug fixes and corrections → merge into `develop`
- **Chore:** Maintenance, dependencies, tooling → merge into `develop`
- **Docs:** Documentation updates → merge into `develop`
- **Refactor:** Code restructuring → merge into `develop`
- **Test:** Testing improvements → merge into `develop`
- **Hotfix:** Critical production fixes → merge directly to `main`

**Examples:**
```
Feature: Add user authentication system
Fix: Resolve button click handler issues
Chore: Update project dependencies to latest versions
Docs: Add comprehensive API documentation
Refactor: Restructure component architecture
Test: Add comprehensive test coverage for Button component
Hotfix: Fix critical security vulnerability
```

**Required PR Template:**

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Feature (new functionality)
- [ ] Fix (bug fix)
- [ ] Chore (maintenance)
- [ ] Docs (documentation)
- [ ] Refactor (code restructuring)
- [ ] Test (testing improvements)
- [ ] Hotfix (critical fix)

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## VS Code Verification Results
- [ ] `npm install` - ✅ Success
- [ ] `npm run build` - ✅ Success  
- [ ] `npm run check` - ✅ Success
- [ ] `npm run test` - ✅ Success

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated if needed
- [ ] No breaking changes (or marked as such)
```

**Merge Strategy:**
- All PRs merge into `develop` branch first
- After merging to `develop`, auto-create PR from `develop` → `main`
- Hotfixes can merge directly to `main` with immediate follow-up to `develop`

## Development Environment

All verification and testing is performed locally in VS Code using the integrated terminal and task runner. The development workflow leverages VS Code's built-in tools for:

- Running npm scripts (`npm install`, `npm run build`, `npm run check`, `npm run test`)
- TypeScript checking and error reporting
- Integrated testing with Vitest
- Live development server monitoring
- Git integration for commits and PRs

All dependencies must be installed with `npm ci` in CI jobs. The Super-Linter runs on every pull request via `.github/workflows/super-linter.yml`.
