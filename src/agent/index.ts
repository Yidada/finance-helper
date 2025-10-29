import { createAgent } from "langchain";
import { InMemoryStore } from "@langchain/langgraph-checkpoint";
import { model } from "../provider/openrouter";
import { getWeather } from "../tools/weather";
import { getTavilyTools } from "../tools/tavily";
import { getSequentialThinkingTools } from "../tools/sequential-thinking";
import { getFilesystemTools } from "../tools/filesystem";
import { DEFAULT_SYSTEM_PROMPT } from "../knowledge/prompts";

/**
 * Create and configure the LangChain agent with MCP tools
 * - Tavily: Web search capability
 * - Sequential Thinking: Step-by-step problem-solving with dynamic reasoning
 * - Filesystem: File and directory operations
 */
async function createAgentWithTools() {
  const { tools: tavilyTools, client: tavilyClient } = await getTavilyTools();
  const { tools: sequentialThinkingTools, client: sequentialThinkingClient } =
    await getSequentialThinkingTools();
  const { tools: filesystemTools, client: filesystemClient } =
    await getFilesystemTools();

  return createAgent({
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    model: model,
    tools: [
      getWeather,
      ...tavilyTools,
      ...sequentialThinkingTools,
      ...filesystemTools,
    ],
    store: new InMemoryStore(),
  });
}

export const agent = await createAgentWithTools();
