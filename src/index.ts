import { agent } from "./agent";
import { createUserMessage, USER_QUERIES } from "./knowledge/prompts";

// Invoke the agent with a weather query
const result = await agent.invoke({
  messages: [createUserMessage(USER_QUERIES.weatherInTokyo)],
});

console.log(result);
