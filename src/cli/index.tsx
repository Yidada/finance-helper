import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import TextInput from "ink-text-input";
import { agent } from "../agent/index.js";
import { createUserMessage } from "../knowledge/prompts.js";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const InteractiveChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { exit } = useApp();

  useInput((input, key) => {
    // Exit on Ctrl+C
    if (key.ctrl && input === "c") {
      exit();
    }
  });

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();

    // Check for exit commands
    if (
      userInput.toLowerCase() === "exit" ||
      userInput.toLowerCase() === "quit"
    ) {
      exit();
      return;
    }

    // Add user message to history
    const userMessage: Message = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Invoke the agent with full conversation history
      const result = await agent.invoke({
        messages: [
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          createUserMessage(userInput),
        ],
      });

      // Extract the response content
      const assistantContent =
        result.messages[result.messages.length - 1]?.content || "No response";

      const assistantMessage: Message = {
        role: "assistant",
        content: String(assistantContent),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : String(error)}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" padding={1} marginBottom={1}>
        <Text bold color="cyan">
          🤖 LangChain Agent - Interactive Chat
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text dimColor>
          Type your questions below. Type 'exit' or press Ctrl+C to quit.
        </Text>
        <Text dimColor>
          ─────────────────────────────────────────────────────
        </Text>
      </Box>

      {/* Message history */}
      <Box flexDirection="column" marginBottom={1}>
        {messages.length === 0 ? (
          <Text dimColor>No messages yet. Ask me anything!</Text>
        ) : (
          messages.map((msg, idx) => (
            <Box key={idx} flexDirection="column" marginBottom={1}>
              <Text bold color={msg.role === "user" ? "green" : "blue"}>
                {msg.role === "user" ? "You" : "Agent"}:
              </Text>
              <Text>{msg.content}</Text>
            </Box>
          ))
        )}
      </Box>

      {/* Loading indicator */}
      {isLoading && (
        <Box marginBottom={1}>
          <Text color="yellow">Agent is thinking...</Text>
        </Box>
      )}

      {/* Input field */}
      <Box>
        <Text color="green" bold>
          {"❯ "}
        </Text>
        <TextInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder="Type your question..."
          focus={!isLoading}
        />
      </Box>
    </Box>
  );
};

render(<InteractiveChat />);
