# Repository Guidelines

## Project Structure & Module Organization
- `src/index.ts` bootstraps the LangChain agent and registers available tools.
- `src/agent/` contains the agent builder; keep routing logic modular and side-effect free.
- `src/tools/` houses tool implementations; add new utilities with clear Zod schemas and export via `index.ts`.
- `src/provider/` wraps external model clients; read credentials from environment variables, not source files.
- `src/knowledge/` maintains reusable prompt fragments; factor shared messaging primitives here.
- `examples/` captures runnable transcripts; update when introducing new capabilities.
- `doc/` stores reference material consumed by the agent; annotate domain assumptions as they evolve.

## Build, Test, and Development Commands
- `bun install` installs dependencies after cloning or switching branches.
- `bun run dev` launches the hot-reload development loop for rapid tool iteration.
- `bun run src/index.ts` executes the agent once with current configuration for smoke validation.
- `bun test` invokes Bun’s test runner; add `--watch` when refining specs.

## Coding Style & Naming Conventions
- Use TypeScript ES modules with 2-space indentation; run `bunx tsc --noEmit` to catch type regressions before review.
- Prefer named exports and explicit types for agent inputs/outputs; co-locate Zod schemas with their tools.
- Apply camelCase to functions, PascalCase to classes, and snake_case to tool identifiers surfaced to LangChain.
- Organize prompts into descriptive objects (e.g., `SYSTEM_MESSAGES`) to keep message builders consistent.

## Testing Guidelines
- Place tests alongside modules as `*.test.ts` or under `src/__tests__/`; mirror directory names for clarity.
- Target schema validation, tool wiring, and provider fallbacks; mock remote calls to keep runs deterministic.
- Maintain coverage on branching logic and document illustrative runs in `examples/` when behavior is complex.

## Commit & Pull Request Guidelines
- Follow concise, imperative commit titles such as `feat: add budget planner` or `chore: refresh knowledge`.
- Reference related issues in the commit or PR body and describe the behavioral impact plus rollout steps.
- In pull requests, include a test plan (`bun run src/index.ts` output or `bun test` results) and attach screenshots for user-facing changes.

## Security & Configuration Tips
- Never commit secrets; configure `OPENROUTER_API_KEY` and other credentials via `.env` and document required keys in PRs.
- Audit new tools for data exposure, rate limits, and exception handling before merging.
