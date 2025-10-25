# Repository Guidelines

## Project Structure & Module Organization
- `src/index.ts` is the entry script that wires user prompts to the LangChain agent.
- `src/agent/` configures the agent object and aggregates all registered tools.
- `src/tools/` holds callable LangChain tools; add new skills here with clear Zod schemas.
- `src/provider/` wraps external model providers. Keep credentials out of source and rely on environment variables.
- `src/knowledge/` stores reusable prompts and message builders. Expand this when adding new conversational domains.

## Build, Test, and Development Commands
- `bun install` installs dependencies defined in `package.json`. Run after cloning or when dependencies change.
- `bun run dev` starts the hot-reloading development loop defined in the repo scripts.
- `bun run src/index.ts` executes the agent once for quick smoke tests.
- Set `OPENROUTER_API_KEY=<token>` in your environment before running any command that hits the model.

## Coding Style & Naming Conventions
- TypeScript is the default; use ES modules and 2-space indentation to match existing files.
- Prefer named exports for modules so cross-file imports stay explicit (`export const agent = ...`).
- Tool names follow `snake_case` identifiers matching the tool description (e.g., `get_weather`).
- When adding prompts, group them in descriptive objects (`SYSTEM_PROMPTS`, `USER_QUERIES`) to keep message builders consistent.

## Testing Guidelines
- Use Bun’s built-in test runner: `bun test`. Place specs beside source files as `*.test.ts` or under `src/__tests__/`.
- Write tests that validate agent tool wiring and schema validation; mock network calls where possible.
- Target meaningful coverage on decision branches (tool selection, prompt generation) rather than just line count.

## Commit & Pull Request Guidelines
- Follow short, imperative commit titles using `<type>: <action>` (e.g., `feat: add calendar tool`). Group related changes per commit.
- In pull requests, describe the agent behavior change, list new commands/config flags, and reference any tracked issue IDs.
- Attach CLI output or screenshots when the change affects runtime behavior or tool responses.

## Security & Configuration Tips
- Never commit API keys. Use `.env` entries loaded automatically by Bun and document required variables in PRs.
- Review new tools for external network calls and document rate limits or required permissions before merging.
