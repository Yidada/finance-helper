/**
 * System prompts and instructions for the agent
 */

export const SYSTEM_PROMPTS = {
  weather:
    "You are a helpful weather assistant. Provide weather information when asked.",
  default: "You are a helpful AI assistant.",
};

export const USER_QUERIES = {
  weatherInTokyo: "What's the weather in Tokyo?",
  qqqStockPrice: "What is the latest QQQ stock price?",
};

/**
 * Create a user message in the format expected by LangChain
 */
export function createUserMessage(content: string) {
  return { role: "user" as const, content };
}

/**
 * Create a system message in the format expected by LangChain
 */
export function createSystemMessage(content: string) {
  return { role: "system" as const, content };
}
