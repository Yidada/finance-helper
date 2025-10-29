/**
 * Main entry point - exports the configured LangChain agent
 *
 * Usage:
 *   import { agent } from "./src/index";
 *   const result = await agent.invoke({ messages: [...] });
 *
 * To start interactive chat, run: bun run cli
 */

export { agent } from "./agent";
export {
  createUserMessage,
  createSystemMessage,
  DEFAULT_SYSTEM_PROMPT,
} from "./knowledge/prompts";
export { model } from "./provider/openrouter";
export { getWeather } from "./tools/weather";
export { getTavilyTools } from "./tools/tavily";
