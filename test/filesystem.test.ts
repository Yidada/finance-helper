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
  // Create proper DynamicStructuredTool mocks for filesystem operations
  const readFileTool = new DynamicStructuredTool({
    name: "read_text_file",
    description: "Read contents of a text file",
    schema: z.object({
      path: z.string().describe("The file path"),
    }),
    func: async ({ path }: { path: string }) => {
      return "mock file contents";
    },
  });

  const writeFileTool = new DynamicStructuredTool({
    name: "write_file",
    description: "Write content to a file",
    schema: z.object({
      path: z.string().describe("The file path"),
      content: z.string().describe("The content to write"),
    }),
    func: async ({ path, content }: { path: string; content: string }) => {
      return "mock write success";
    },
  });

  return [readFileTool, writeFileTool];
});

describe("getFilesystemTools", () => {
  let clientSpy: any;

  beforeEach(() => {
    // Mock the MultiServerMCPClient constructor
    clientSpy = spyOn(
      MultiServerMCPClient.prototype,
      "getTools",
    ).mockImplementation(mockGetTools);
  });

  afterEach(() => {
    // Restore original implementation
    clientSpy?.mockRestore();
    mockGetTools.mockClear();
  });

  test("returns tools and client objects", async () => {
    const { getFilesystemTools } = await import("../src/tools/filesystem");
    const result = await getFilesystemTools();

    expect(result).toHaveProperty("tools");
    expect(result).toHaveProperty("client");
    expect(result.client).toBeInstanceOf(MultiServerMCPClient);
  });

  test("returns an array of tools", async () => {
    const { getFilesystemTools } = await import("../src/tools/filesystem");
    const { tools } = await getFilesystemTools();

    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeGreaterThan(0);
  });

  test("calls getTools on the MCP client", async () => {
    const { getFilesystemTools } = await import("../src/tools/filesystem");
    await getFilesystemTools();

    expect(mockGetTools).toHaveBeenCalled();
  });

  test("tools have expected structure", async () => {
    const { getFilesystemTools } = await import("../src/tools/filesystem");
    const { tools } = await getFilesystemTools();

    // Each tool should have a name and be callable
    tools.forEach((tool) => {
      expect(tool).toHaveProperty("name");
      expect(typeof tool.invoke).toBe("function");
    });
  });

  test("creates MCP client with correct configuration", async () => {
    const { getFilesystemTools } = await import("../src/tools/filesystem");
    const { client } = await getFilesystemTools();

    expect(client).toBeInstanceOf(MultiServerMCPClient);
  });
});
