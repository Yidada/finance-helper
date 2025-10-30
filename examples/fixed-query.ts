/**
 * Example script demonstrating agent invocation with a fixed query
 *
 * This script shows how to use the LangChain agent programmatically
 * with a predefined query. The agent will use available tools (weather,
 * web search, sequential thinking, filesystem) to answer the query.
 *
 * Run with: bun run example
 */

import { agent, createUserMessage } from "../src/index";

/**
 * Fixed query for the agent to process
 * Modify this to test different queries
 */
const FIXED_QUERY =
  "What's the weather in San Francisco and can you search for recent AI news?";

async function main() {
  console.log("🤖 LangChain Agent - Fixed Query Example\n");
  console.log(`Query: ${FIXED_QUERY}\n`);
  console.log("Processing...\n");

  try {
    // Invoke the agent with the fixed query
    const result = await agent.invoke({
      messages: [createUserMessage(FIXED_QUERY)],
    });

    console.log("─".repeat(60));
    console.log("Response:");
    console.log("─".repeat(60));

    // Display the agent's response
    if (result && result.messages && result.messages.length > 0) {
      const lastMessage = result.messages[result.messages.length - 1];
      console.log(lastMessage.content);
    } else {
      console.log("No response from agent");
    }

    console.log("\n" + "─".repeat(60));
    console.log("✅ Complete");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
