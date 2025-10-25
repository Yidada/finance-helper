import {
  describe,
  expect,
  test,
  beforeEach,
  afterEach,
  mock,
  spyOn,
} from "bun:test";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// Mock the MultiServerMCPClient to avoid spawning actual MCP subprocess
const mockGetTools = mock(async () => {
  // Create a proper DynamicStructuredTool mock
  const mockTool = new DynamicStructuredTool({
    name: "tavily_search",
    description: "Search the web using Tavily",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
    func: async ({ query }: { query: string }) => {
      return "mock search result";
    },
  });

  return [mockTool];
});

describe("getTavilyTools", () => {
  const originalEnv = process.env.TAVILY_API_KEY;
  let clientSpy: any;

  beforeEach(() => {
    // Reset environment before each test
    process.env.TAVILY_API_KEY = "tvly-test-key-123";

    // Mock the MultiServerMCPClient constructor
    clientSpy = spyOn(
      MultiServerMCPClient.prototype,
      "getTools",
    ).mockImplementation(mockGetTools);
  });

  afterEach(() => {
    // Restore original environment
    process.env.TAVILY_API_KEY = originalEnv;
    clientSpy?.mockRestore();
    mockGetTools.mockClear();
  });

  test("returns tools and client objects", async () => {
    const { getTavilyTools } = await import("../src/tools/tavily");
    const result = await getTavilyTools();

    expect(result).toHaveProperty("tools");
    expect(result).toHaveProperty("client");
    expect(result.client).toBeInstanceOf(MultiServerMCPClient);
  });

  test("returns an array of tools", async () => {
    const { getTavilyTools } = await import("../src/tools/tavily");
    const { tools } = await getTavilyTools();

    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeGreaterThan(0);
  });

  test("calls getTools on the MCP client", async () => {
    const { getTavilyTools } = await import("../src/tools/tavily");
    await getTavilyTools();

    expect(mockGetTools).toHaveBeenCalled();
  });

  test("tools have expected structure", async () => {
    const { getTavilyTools } = await import("../src/tools/tavily");
    const { tools } = await getTavilyTools();

    // Each tool should have a name and be callable
    tools.forEach((tool) => {
      expect(tool).toHaveProperty("name");
      expect(typeof tool.invoke).toBe("function");
    });
  });

  test("creates MCP client with correct configuration", async () => {
    const { getTavilyTools } = await import("../src/tools/tavily");
    process.env.TAVILY_API_KEY = "tvly-custom-key";

    const { client } = await getTavilyTools();

    expect(client).toBeInstanceOf(MultiServerMCPClient);
  });
});
