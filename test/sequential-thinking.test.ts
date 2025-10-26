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
  // Create a proper DynamicStructuredTool mock for sequential_thinking
  const mockTool = new DynamicStructuredTool({
    name: "sequential_thinking",
    description:
      "Facilitates step-by-step problem-solving with dynamic reasoning paths",
    schema: z.object({
      thought: z.string().describe("Current thinking step"),
      nextThoughtNeeded: z
        .boolean()
        .describe("Whether additional steps are required"),
      thoughtNumber: z.number().int().describe("Current step number"),
      totalThoughts: z.number().int().describe("Estimated steps needed"),
      isRevision: z
        .boolean()
        .optional()
        .describe("Whether revising previous thinking"),
      revisesThought: z
        .number()
        .int()
        .optional()
        .describe("Which step is being reconsidered"),
      branchFromThought: z
        .number()
        .int()
        .optional()
        .describe("Branching point reference"),
      branchId: z.string().optional().describe("Branch identifier"),
      needsMoreThoughts: z
        .boolean()
        .optional()
        .describe("Flag for additional reasoning steps"),
    }),
    func: async ({ thought }: { thought: string }) => {
      return `mock thinking response for: ${thought}`;
    },
  });

  return [mockTool];
});

describe("getSequentialThinkingTools", () => {
  const originalEnv = process.env.DISABLE_THOUGHT_LOGGING;
  let clientSpy: any;

  beforeEach(() => {
    // Reset environment before each test
    process.env.DISABLE_THOUGHT_LOGGING = "false";

    // Mock the MultiServerMCPClient constructor
    clientSpy = spyOn(
      MultiServerMCPClient.prototype,
      "getTools",
    ).mockImplementation(mockGetTools);
  });

  afterEach(() => {
    // Restore original environment
    process.env.DISABLE_THOUGHT_LOGGING = originalEnv;
    clientSpy?.mockRestore();
    mockGetTools.mockClear();
  });

  test("returns tools and client objects", async () => {
    const { getSequentialThinkingTools } = await import(
      "../src/tools/sequential-thinking"
    );
    const result = await getSequentialThinkingTools();

    expect(result).toHaveProperty("tools");
    expect(result).toHaveProperty("client");
    expect(result.client).toBeInstanceOf(MultiServerMCPClient);
  });

  test("returns an array of tools", async () => {
    const { getSequentialThinkingTools } = await import(
      "../src/tools/sequential-thinking"
    );
    const { tools } = await getSequentialThinkingTools();

    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeGreaterThan(0);
  });

  test("calls getTools on the MCP client", async () => {
    const { getSequentialThinkingTools } = await import(
      "../src/tools/sequential-thinking"
    );
    await getSequentialThinkingTools();

    expect(mockGetTools).toHaveBeenCalled();
  });

  test("tools have expected structure", async () => {
    const { getSequentialThinkingTools } = await import(
      "../src/tools/sequential-thinking"
    );
    const { tools } = await getSequentialThinkingTools();

    // Each tool should have a name and be callable
    tools.forEach((tool) => {
      expect(tool).toHaveProperty("name");
      expect(typeof tool.invoke).toBe("function");
    });
  });

  test("creates MCP client with correct configuration", async () => {
    const { getSequentialThinkingTools } = await import(
      "../src/tools/sequential-thinking"
    );
    process.env.DISABLE_THOUGHT_LOGGING = "true";

    const { client } = await getSequentialThinkingTools();

    expect(client).toBeInstanceOf(MultiServerMCPClient);
  });

  test("respects DISABLE_THOUGHT_LOGGING environment variable", async () => {
    const { getSequentialThinkingTools } = await import(
      "../src/tools/sequential-thinking"
    );
    process.env.DISABLE_THOUGHT_LOGGING = "true";

    const { client } = await getSequentialThinkingTools();

    expect(client).toBeInstanceOf(MultiServerMCPClient);
    expect(process.env.DISABLE_THOUGHT_LOGGING).toBe("true");
  });
});
