# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---
description: LangChain agent demo using Bun runtime. Use Bun instead of Node.js, npm, pnpm, or vite.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

## Project Overview

This is a LangChain agent demonstration that uses OpenRouter to access Claude Sonnet 4.5. The agent is configured with tools and can be invoked to perform tasks using AI-powered function calling.

## Runtime: Bun

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";

// import .css files directly and it works
import './index.css';

import { createRoot } from "react-dom/client";

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.

## LangChain Agent Architecture

### Model Configuration

This project uses **OpenRouter** as the LLM provider, configured through `@langchain/openai`'s `ChatOpenAI` class with a custom base URL:

```typescript
const model = new ChatOpenAI({
  model: "anthropic/claude-sonnet-4.5",
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});
```

**Important Notes:**
- OpenRouter is not a native LangChain provider, so it must be configured through the OpenAI-compatible interface
- The API key must be passed as `apiKey` (not `openAIApiKey`)
- The model name must be passed as `model` (not `modelName`)
- Environment variable: `OPENROUTER_API_KEY` (required in global environment or `.env` file)

### Agent Structure

The agent is created using LangChain's `createAgent()` function:
- **Model**: Pass a pre-configured model instance (not a model string) when using OpenRouter
- **Tools**: Defined using `tool()` helper with Zod schemas for validation
- **Invocation**: Uses `.invoke()` with messages array containing role and content

### Running the Agent

```bash
# Set environment variable (if not already in global env)
export OPENROUTER_API_KEY=your-key-here

# Run the agent
bun run index.ts
```

### Adding New Tools

Tools are defined using the `tool()` helper from LangChain:

```typescript
import { tool } from "langchain";
import { z } from "zod";

const myTool = tool(
  (input) => {
    // Tool implementation
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

Then add to the agent's `tools` array when creating the agent.
