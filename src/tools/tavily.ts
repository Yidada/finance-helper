import { MultiServerMCPClient } from "@langchain/mcp-adapters";

/**
 * Initialize Tavily MCP client and retrieve search tools
 * Requires TAVILY_API_KEY environment variable
 */
export async function getTavilyTools() {
  const client = new MultiServerMCPClient({
    tavily: {
      transport: "stdio",
      command: "npx",
      args: ["-y", "tavily-mcp@0.1.3"],
      env: {
        TAVILY_API_KEY: process.env.TAVILY_API_KEY || "",
      },
    },
  });

  // Fetch all tools from the Tavily MCP server
  const tools = await client.getTools();

  return { tools, client };
}
