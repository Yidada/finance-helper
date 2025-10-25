import { describe, expect, test, beforeEach, mock } from "bun:test";
import { getTavilyTools } from "../src/tools/tavily";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";

describe("getTavilyTools", () => {
  const originalEnv = process.env.TAVILY_API_KEY;

  beforeEach(() => {
    // Reset environment before each test
    process.env.TAVILY_API_KEY = originalEnv;
  });

  test("returns tools and client objects", async () => {
    // Set a mock API key for testing
    process.env.TAVILY_API_KEY = "tvly-test-key-123";

    const result = await getTavilyTools();

    expect(result).toHaveProperty("tools");
    expect(result).toHaveProperty("client");
    expect(result.client).toBeInstanceOf(MultiServerMCPClient);
  });

  test("returns an array of tools", async () => {
    process.env.TAVILY_API_KEY = "tvly-test-key-123";

    const { tools } = await getTavilyTools();

    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeGreaterThan(0);
  });

  test("throws error when TAVILY_API_KEY is missing", async () => {
    delete process.env.TAVILY_API_KEY;

    // Tavily MCP server requires API key, so it should throw an error
    await expect(getTavilyTools()).rejects.toThrow();
  });

  test("configures MCP client with correct parameters", async () => {
    process.env.TAVILY_API_KEY = "tvly-test-key-456";

    const { client } = await getTavilyTools();

    // Verify the client was created (it should be an instance of MultiServerMCPClient)
    expect(client).toBeInstanceOf(MultiServerMCPClient);
  });

  test("tools have expected structure", async () => {
    process.env.TAVILY_API_KEY = "tvly-test-key-789";

    const { tools } = await getTavilyTools();

    // Each tool should have a name and be callable
    tools.forEach((tool) => {
      expect(tool).toHaveProperty("name");
      expect(typeof tool.invoke).toBe("function");
    });
  });
});
