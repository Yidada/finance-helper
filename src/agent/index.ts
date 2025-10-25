import { createAgent } from "langchain";
import { model } from "../provider/openrouter";
import { getWeather } from "../tools/weather";

/**
 * Create and configure the LangChain agent
 */
export const agent = createAgent({
  model: model,
  tools: [getWeather],
});
