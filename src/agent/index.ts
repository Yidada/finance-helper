import { createAgent } from "langchain";
import { model } from "../provider/openrouter";
import { getWeather } from "../tools/weather";
import { getTavilyTools } from "../tools/tavily";

/**
 * Create and configure the LangChain agent with Tavily MCP tools
 */
async function createAgentWithTools() {
  const { tools: tavilyTools, client } = await getTavilyTools();

  return createAgent({
    model: model,
    tools: [getWeather, ...tavilyTools],
  });
}

export const agent = await createAgentWithTools();
