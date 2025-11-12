import { createAgent } from "langchain";
import { InMemoryStore } from "@langchain/langgraph-checkpoint";
import { model } from "../provider";
import { getWeather } from "../tools/weather";
import { getTavilyTools } from "../tools/tavily";
import { getSequentialThinkingTools } from "../tools/sequential-thinking";
import { getFilesystemTools } from "../tools/filesystem";
import { kimiCli } from "../tools/kimi-cli";
import { DEFAULT_SYSTEM_PROMPT } from "../knowledge/prompts";

/**
 * Create and configure the LangChain agent with MCP tools and Kimi CLI
 * - Tavily: Web search capability
 * - Sequential Thinking: Step-by-step problem-solving with dynamic reasoning
 * - Filesystem: File and directory operations
 * - Kimi CLI: Complex terminal operations via Kimi CLI agent
 */
async function createAgentWithTools() {
  const { tools: tavilyTools, client: _tavilyClient } = await getTavilyTools();
  const { tools: sequentialThinkingTools, client: _sequentialThinkingClient } =
    await getSequentialThinkingTools();
  const { tools: filesystemTools, client: _filesystemClient } =
    await getFilesystemTools();

  return createAgent({
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    model: model,
    tools: [
      getWeather,
      kimiCli,
      ...tavilyTools,
      ...sequentialThinkingTools,
      ...filesystemTools,
    ],
    store: new InMemoryStore(),
  });
}

export const agent = await createAgentWithTools();
