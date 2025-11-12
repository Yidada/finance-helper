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

**NEVER USE ABSOLUTE STATIC PATHS:**
- ❌ NEVER hardcode absolute paths like `/Users/username/project`
- ❌ NEVER use static paths that are machine-specific
- ✅ ALWAYS use dynamic path resolution: `cwd()`, `__dirname`, `import.meta.url`
- ✅ ALWAYS ensure code works across different machines and environments

## Project Overview

A LangChain agent demonstration with flexible LLM provider support (OpenRouter or Moonshot AI/Kimi), Model Context Protocol (MCP) integration, and Kimi CLI integration for enhanced terminal operations. The agent combines traditional LangChain tools with MCP servers (Tavily for web search, Sequential Thinking for step-by-step reasoning, and Filesystem for file operations), plus direct integration with Kimi CLI for complex terminal tasks.

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
├── provider/     # LLM provider setup (OpenRouter, Moonshot AI)
│   ├── index.ts             # Provider selection logic
│   ├── openrouter.ts        # OpenRouter configuration
│   └── moonshot.ts          # Moonshot AI (Kimi) configuration
├── tools/        # LangChain tools and MCP integrations
│   ├── tavily.ts            # Web search via Tavily MCP
│   ├── sequential-thinking.ts # Step-by-step reasoning MCP
│   ├── filesystem.ts        # File operations MCP
│   ├── kimi-cli.ts          # Kimi CLI integration
│   └── weather.ts           # Weather tool (example)
└── knowledge/    # Prompts and message helpers

test/             # Test files (using bun:test)
```

### Key Architectural Patterns

**1. Agent Initialization (src/agent/index.ts)**

The agent is created using top-level await to initialize MCP tools asynchronously:

```typescript
async function createAgentWithTools() {
  const { tools: tavilyTools } = await getTavilyTools();
  const { tools: sequentialThinkingTools } = await getSequentialThinkingTools();
  const { tools: filesystemTools } = await getFilesystemTools();
  return createAgent({
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    model: model,
    tools: [
      getWeather,
      kimiCli,
      ...tavilyTools,
      ...sequentialThinkingTools,
      ...filesystemTools
    ],
    store: new InMemoryStore(),
  });
}

export const agent = await createAgentWithTools();
```

**Important:** 
- When importing the agent, files must support top-level await (ESM modules)
- The agent includes `InMemoryStore()` for short-term conversation memory
- System prompt is configured via `DEFAULT_SYSTEM_PROMPT` from `src/knowledge/prompts.ts`

**2. Tool Types**

The project uses three types of tools:

- **LangChain Tools** (src/tools/weather.ts, src/tools/kimi-cli.ts): Defined with `tool()` helper, Zod schemas
- **MCP Tools** (src/tools/tavily.ts, src/tools/sequential-thinking.ts, src/tools/filesystem.ts): Retrieved from MCP servers via `@langchain/mcp-adapters`
- **Kimi CLI Tool** (src/tools/kimi-cli.ts): Direct integration with Kimi CLI for complex terminal operations

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

**Current MCP Integrations:**
- **Tavily** (web search): `tavily-mcp@0.1.3`
- **Sequential Thinking** (step-by-step reasoning): `@modelcontextprotocol/server-sequential-thinking`
- **Filesystem** (file operations): `@modelcontextprotocol/server-filesystem`
  - Provides: read_text_file, read_media_file, read_multiple_files, write_file, edit_file, create_directory, list_directory, move_file, search_files, directory_tree, get_file_info
  - Allowed directories configured in `src/tools/filesystem.ts` (currently: project root)

**4. CLI Interface (src/cli/index.tsx)**

Interactive chat interface built with Ink (React for CLIs):
- Maintains conversation history in component state
- Sends full message history with each agent invocation for context
- Supports `exit`, `quit` commands and Ctrl+C to exit
- Visual loading indicators during agent processing
- All messages rendered with role-based color coding

## Model Configuration

**Multi-Provider Support via OpenAI-compatible Interface:**

This project supports multiple LLM providers configured through `@langchain/openai`. The provider is selected via the `PROVIDER` environment variable (defaults to "openrouter").

**Provider: OpenRouter (Default)**

```typescript
const model = new ChatOpenAI({
  model: "anthropic/claude-haiku-4.5",
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});
```

**Provider: Moonshot AI (Kimi)**

```typescript
const model = new ChatOpenAI({
  model: "moonshot-v1-8k",
  apiKey: process.env.MOONSHOT_API_KEY,
  configuration: {
    baseURL: "https://api.moonshot.cn/v1",
  },
});
```

**Critical Configuration Details:**
- Use `apiKey` parameter (NOT `openAIApiKey`)
- Use `model` parameter (NOT `modelName`)
- Set `PROVIDER` environment variable to "openrouter" or "moonshot"
- Pass pre-configured model instance to `createAgent()` (not a model string)
- Requires corresponding API key environment variable for selected provider

## Environment Variables

Required in `.env` file or global environment:

```bash
# Provider Selection (optional, defaults to "openrouter")
PROVIDER=openrouter              # Options: "openrouter" | "moonshot"

# LLM Provider API Keys (required based on PROVIDER)
OPENROUTER_API_KEY=sk-or-...     # Required when PROVIDER=openrouter
MOONSHOT_API_KEY=...             # Required when PROVIDER=moonshot

# MCP Tools
TAVILY_API_KEY=tvly-...          # Required for web search via Tavily MCP

# Optional Configuration
DISABLE_THOUGHT_LOGGING=false    # Set to "true" to suppress Sequential Thinking logs
```

See `.env.example` for template.

### Kimi CLI Tool

The Kimi CLI tool integration allows the agent to delegate complex terminal operations to Kimi CLI. To use this tool:

```bash
# Install Kimi CLI (requires uv and Python 3.13)
uv tool install --python 3.13 kimi-cli

# Verify installation
kimi --help
```

The tool is automatically available to the agent once installed. No additional configuration required.

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

**Conversation Memory:**
The agent uses `InMemoryStore()` for short-term memory. To maintain context across multiple invocations, pass the full message history with each call (as done in `src/cli/index.tsx`).

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
- The CLI maintains conversation history to provide context to the agent across multiple turns
