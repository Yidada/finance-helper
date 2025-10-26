/**
 * Message utilities for LangChain agent invocation
 */

/**
 * Default system prompt for the agent
 */
export const DEFAULT_SYSTEM_PROMPT = `
   You are a helpful AI assistant with access to various tools.
   Use the available tools to help answer questions and complete tasks accurately.
   When searching for information, use the search tool.
   When asked about weather, use the weather tool.

   Always Generate a TODO list of steps to complete the user's request.
   Then, use the tools as needed to complete each step.
   Finally, summarize the results for the user.
`;

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
