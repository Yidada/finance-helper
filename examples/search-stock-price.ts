import { agent } from "../src/agent";
import { createUserMessage, USER_QUERIES } from "../src/knowledge/prompts";

/**
 * Example: Search for the latest QQQ stock price using Tavily MCP
 *
 * This demonstrates how the agent uses Tavily's web search capability
 * to find real-time stock price information.
 *
 * Prerequisites:
 * - TAVILY_API_KEY environment variable must be set
 * - OPENROUTER_API_KEY environment variable must be set
 */

console.log("🔍 Searching for latest QQQ stock price...\n");

const result = await agent.invoke({
  messages: [createUserMessage(USER_QUERIES.qqqStockPrice)],
});

console.log("📊 Result:\n");
console.log(result);
