import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { cwd } from "process";

/**
 * Initialize Filesystem MCP client and retrieve filesystem tools
 *
 * The Filesystem tool enables file and directory operations including:
 * - Reading/writing files
 * - Creating/listing/deleting directories
 * - Moving files/directories
 * - Searching files
 * - Getting file metadata
 *
 * Allowed directories are specified as command arguments for security.
 * By default, allows access to the current working directory.
 */
export async function getFilesystemTools() {
  const client = new MultiServerMCPClient({
    filesystem: {
      transport: "stdio",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem", cwd()],
    },
  });

  // Fetch all tools from the Filesystem MCP server
  const tools = await client.getTools();

  return { tools, client };
}
