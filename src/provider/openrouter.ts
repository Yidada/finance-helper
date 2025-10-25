import { ChatOpenAI } from "@langchain/openai";

/**
 * Configure ChatOpenAI to use OpenRouter as the provider
 * Requires OPENROUTER_API_KEY environment variable
 */
export const model = new ChatOpenAI({
  model: "anthropic/claude-sonnet-4.5",
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});
