import { MultiServerMCPClient } from "@langchain/mcp-adapters";

/**
 * Initialize Sequential Thinking MCP client and retrieve thinking tools
 *
 * The Sequential Thinking tool enables step-by-step problem-solving with
 * dynamic reasoning paths, supporting complex problem decomposition and
 * iterative refinement.
 *
 * Optional: Set DISABLE_THOUGHT_LOGGING=true to suppress thought logging
 */
export async function getSequentialThinkingTools() {
  const client = new MultiServerMCPClient({
    "sequential-thinking": {
      transport: "stdio",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      env: {
        DISABLE_THOUGHT_LOGGING: process.env.DISABLE_THOUGHT_LOGGING || "",
      },
    },
  });

  // Fetch all tools from the Sequential Thinking MCP server
  const tools = await client.getTools();

  return { tools, client };
}
