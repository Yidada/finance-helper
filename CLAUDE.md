# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---
description: LangChain agent with MCP (Model Context Protocol) integration using Bun runtime
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

## CRITICAL RULES

**NEVER AUTOMATICALLY COMMIT OR PUSH:**
- ❌ NEVER run `git commit` without explicit user permission
- ❌ NEVER run `git push` without explicit user permission
- ❌ NEVER run `git add` and `git commit` in sequence without asking first
- ✅ ALWAYS ask "Should I commit these changes?" before committing
- ✅ ALWAYS ask "Should I push to remote?" before pushing
- ✅ ALWAYS wait for explicit user confirmation

This rule applies to ALL situations, even if the task seems complete or the user asks to "finish" something.

## Project Overview

A LangChain agent demonstration using OpenRouter to access Claude Sonnet 4.5, with Model Context Protocol (MCP) integration for extended tool capabilities. The agent combines traditional LangChain tools with MCP servers (currently Tavily for web search).

**Entry Point:** `src/index.ts` exports the configured agent and utilities. Use `bun run cli` for interactive chat.

## Runtime: Bun

**Always use Bun, never Node.js, npm, pnpm, or vite:**

- `bun install` - Install dependencies
- `bun test` - Run all tests
- `bun test <file>` - Run specific test file
- `bun run cli` - Start interactive chat with the agent

Bun automatically loads `.env` files - no dotenv package needed.

## Common Commands

```bash
# Interactive Chat
bun run cli                   # Start the interactive chat interface

# Testing
bun test                      # Run all tests
bun test test/tavily.test.ts  # Run specific test file

# Dependencies
bun install                   # Install packages
bun add <package>             # Add new dependency
```

## Architecture

### Directory Structure

```
src/
├── agent/        # Agent initialization and configuration
├── cli/          # Interactive chat interface (Ink-based)
├── provider/     # LLM provider setup (OpenRouter)
├── tools/        # LangChain tools and MCP integrations
└── knowledge/    # Prompts and message helpers

test/             # Test files (using bun:test)
```

### Key Architectural Patterns

**1. Agent Initialization (src/agent/index.ts)**

The agent is created using top-level await to initialize MCP tools asynchronously:

```typescript
async function createAgentWithTools() {
  const { tools: tavilyTools } = await getTavilyTools();
  return createAgent({
    model: model,
    tools: [getWeather, ...tavilyTools],
  });
}

export const agent = await createAgentWithTools();
```

**Important:** When importing the agent, files must support top-level await (ESM modules).

**2. Tool Types**

The project uses two types of tools:

- **LangChain Tools** (src/tools/weather.ts): Defined with `tool()` helper, Zod schemas
- **MCP Tools** (src/tools/tavily.ts): Retrieved from MCP servers via `@langchain/mcp-adapters`

**3. MCP Integration**

MCP tools are initialized via `MultiServerMCPClient` with stdio transport:

```typescript
const client = new MultiServerMCPClient({
  tavily: {
    transport: "stdio",
    command: "npx",
    args: ["-y", "tavily-mcp@0.1.3"],
    env: { TAVILY_API_KEY: process.env.TAVILY_API_KEY },
  },
});
```

MCP servers run as subprocesses spawned by npx. The client fetches available tools dynamically via `client.getTools()`.

## Model Configuration

**OpenRouter via OpenAI-compatible Interface:**

This project uses OpenRouter (not native LangChain provider) configured through `@langchain/openai`:

```typescript
const model = new ChatOpenAI({
  model: "anthropic/claude-sonnet-4.5",
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});
```

**Critical Configuration Details:**
- Use `apiKey` parameter (NOT `openAIApiKey`)
- Use `model` parameter (NOT `modelName`)
- Pass pre-configured model instance to `createAgent()` (not a model string)
- Requires `OPENROUTER_API_KEY` environment variable

## Environment Variables

Required in `.env` file or global environment:

```bash
OPENROUTER_API_KEY=sk-or-...     # Required for LLM
TAVILY_API_KEY=tvly-...          # Required for web search via Tavily MCP
```

See `.env.example` for template.

## Testing

**Use `bun:test` framework** (not jest, vitest, or other test runners):

```typescript
import { describe, expect, test } from "bun:test";
```

**Testing Strategy:**

- **Unit tests with mocking** - Mock external dependencies (MCP clients, API calls) to avoid subprocess spawning
- **Fast execution** - Tests should complete in <100ms
- **Clean output** - No error messages from spawned processes

**Example: Mocking MCP Client**

```typescript
import { mock, spyOn } from "bun:test";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";

const mockGetTools = mock(() => Promise.resolve([/* mock tools */]));
spyOn(MultiServerMCPClient.prototype, "getTools").mockImplementation(mockGetTools);
```

See `test/tavily.test.ts` for complete example of MCP mocking.

## Adding New Tools

### LangChain Tool

```typescript
import { tool } from "langchain";
import { z } from "zod";

export const myTool = tool(
  ({ param }) => {
    // Implementation
    return result;
  },
  {
    name: "tool_name",
    description: "Tool description for the LLM",
    schema: z.object({
      param: z.string().describe("Parameter description"),
    }),
  }
);
```

Add to `src/agent/index.ts` tools array.

### MCP Tool Integration

1. Create new file in `src/tools/<name>.ts`
2. Configure `MultiServerMCPClient` with appropriate transport
3. Export async function that returns `{ tools, client }`
4. Import and spread tools in `src/agent/index.ts`
5. Add required environment variables to `.env.example`
6. Create mocked tests to avoid subprocess spawning

## Agent Invocation Pattern

```typescript
import { agent } from "./agent";
import { createUserMessage } from "./knowledge/prompts";

const result = await agent.invoke({
  messages: [createUserMessage("Your query here")],
});
```

Messages must have `role` ("user" | "system") and `content` properties.

## Bun-Specific APIs

When building features beyond LangChain:

- `Bun.serve()` for HTTP servers (supports WebSockets, routes) - don't use Express
- `bun:sqlite` for SQLite - don't use better-sqlite3
- `Bun.file()` for file operations - prefer over node:fs
- `Bun.$` for shell commands - instead of execa

## Important Notes

- Frontend support available via HTML imports with `Bun.serve()` if needed (see Bun docs)
- MCP servers require Node.js v20+ for npx execution
- Tool descriptions are critical - the LLM uses them to decide when to invoke tools
