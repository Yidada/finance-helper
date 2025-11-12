import { ChatOpenAI } from "@langchain/openai";

/**
 * Configure ChatOpenAI to use Moonshot AI (Kimi) as the provider
 * Requires MOONSHOT_API_KEY environment variable
 *
 * Moonshot AI provides Kimi K2 models with OpenAI-compatible API
 * Get your API key from: https://platform.moonshot.ai/
 */
export const model = new ChatOpenAI({
  model: "moonshot-v1-8k",
  apiKey: process.env.MOONSHOT_API_KEY,
  configuration: {
    baseURL: "https://api.moonshot.cn/v1",
  },
});
