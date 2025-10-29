/**
 * Example: Interactive Chat CLI
 *
 * This demonstrates the interactive question-and-answer interface
 * that allows users to chat with the LangChain agent in real-time.
 *
 * Features:
 * - Real-time conversation with the agent
 * - Message history display
 * - Loading indicators
 * - Exit with 'exit', 'quit', or Ctrl+C
 *
 * Prerequisites:
 * - OPENROUTER_API_KEY environment variable must be set
 * - TAVILY_API_KEY environment variable (for web search queries)
 *
 * Usage:
 *   bun examples/interactive-chat.ts
 *   or
 *   bun run example:chat
 */

// The CLI component is now in src/cli/index.tsx
// This file simply imports and runs it
import "../src/cli/index.js";
