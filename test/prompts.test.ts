import { describe, expect, test } from "bun:test";
import {
  SYSTEM_PROMPTS,
  USER_QUERIES,
  createSystemMessage,
  createUserMessage,
} from "../src/knowledge/prompts";

describe("prompt helpers", () => {
  test("createUserMessage produces a LangChain user payload", () => {
    const message = createUserMessage(USER_QUERIES.weatherInTokyo);

    expect(message).toEqual({
      role: "user",
      content: "What's the weather in Tokyo?",
    });
  });

  test("createSystemMessage uses the system role", () => {
    const message = createSystemMessage(SYSTEM_PROMPTS.weather);

    expect(message).toEqual({
      role: "system",
      content: SYSTEM_PROMPTS.weather,
    });
  });
});
