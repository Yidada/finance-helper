# langchain-demo

A LangChain agent demonstration using OpenRouter to access Claude Sonnet 4.5, with Model Context Protocol (MCP) integration for extended tool capabilities.

## Installation

To install dependencies:

```bash
bun install
```

## Usage

### Interactive CLI Chat

Launch the interactive question-and-answer interface:

```bash
bun run example:chat
# or
bun run cli
```

Features:
- Real-time conversation with the LangChain agent
- Message history display
- Access to web search (Tavily) and weather tools
- Type `exit` or `quit` to exit, or press Ctrl+C

### Example Scripts

Run weather query example:
```bash
bun run example:weather
```

Run stock price search example:
```bash
bun run example:search
```

## Environment Variables

Create a `.env` file with the following variables:

```bash
OPENROUTER_API_KEY=sk-or-...     # Required for LLM
TAVILY_API_KEY=tvly-...          # Required for web search
```

See `.env.example` for template.

This project was created using `bun init` in bun v1.3.1. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.