import { describe, expect, test } from "bun:test";
import {
  createSystemMessage,
  createUserMessage,
} from "../src/knowledge/prompts";

describe("prompt helpers", () => {
  test("createUserMessage produces a LangChain user payload", () => {
    const message = createUserMessage("Test user query");

    expect(message).toEqual({
      role: "user",
      content: "Test user query",
    });
  });

  test("createSystemMessage uses the system role", () => {
    const message = createSystemMessage("Test system prompt");

    expect(message).toEqual({
      role: "system",
      content: "Test system prompt",
    });
  });
});
