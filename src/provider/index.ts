import { ChatOpenAI } from "@langchain/openai";

/**
 * Provider configuration - supports multiple LLM providers
 * Set PROVIDER environment variable to choose: "openrouter" | "moonshot"
 * Defaults to "openrouter" if not specified
 */

const PROVIDER = process.env.PROVIDER || "openrouter";

let model: ChatOpenAI;

switch (PROVIDER) {
  case "moonshot": {
    if (!process.env.MOONSHOT_API_KEY) {
      throw new Error(
        "MOONSHOT_API_KEY environment variable is required when PROVIDER=moonshot"
      );
    }
    /**
     * Moonshot AI (Kimi) provider
     * API docs: https://platform.moonshot.ai/docs
     */
    model = new ChatOpenAI({
      model: "moonshot-v1-8k",
      apiKey: process.env.MOONSHOT_API_KEY,
      configuration: {
        baseURL: "https://api.moonshot.cn/v1",
      },
    });
    console.log("Using Moonshot AI (Kimi) provider");
    break;
  }
  case "openrouter":
  default: {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error(
        "OPENROUTER_API_KEY environment variable is required when PROVIDER=openrouter"
      );
    }
    /**
     * OpenRouter provider (default)
     * Supports multiple models including Claude, GPT, etc.
     */
    model = new ChatOpenAI({
      model: "anthropic/claude-haiku-4.5",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
    });
    console.log("Using OpenRouter provider");
    break;
  }
}

export { model };
