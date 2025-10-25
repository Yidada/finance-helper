import { agent } from "../src/agent";
import { createUserMessage } from "../src/knowledge/prompts";

/**
 * Example: Query weather using the weather tool
 *
 * This demonstrates basic agent invocation with a simple tool.
 *
 * Prerequisites:
 * - OPENROUTER_API_KEY environment variable must be set
 */

const QUERY = "What's the weather in Tokyo?";

console.log("🌤️  Querying weather in Tokyo...\n");

const result = await agent.invoke({
  messages: [createUserMessage(QUERY)],
});

console.log("📋 Result:\n");
console.log(result);
