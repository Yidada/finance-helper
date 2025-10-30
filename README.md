# Finance Helper

An AI-powered investment assistant for Singapore-based investors, providing Dollar Cost Averaging (DCA) calculations, fee modeling, and return analysis for moomoo platform investments. Built with LangChain agent architecture using Claude Haiku 4.5 via OpenRouter, with Model Context Protocol (MCP) integration for extended capabilities.

## Features

- **Investment Calculations**: DCA simulation for QQQ, TLT, 03032, DBS with multi-period analysis (1Y/3Y/5Y/10Y)
- **Fee Modeling**: Accurate moomoo Singapore fee calculations including platform fees, commissions, GST (9%), and market-specific charges
- **FX Spread Analysis**: Model currency conversion costs for USD/HKD assets
- **Interactive CLI Chat**: Conversational interface for investment queries and calculations
- **Comprehensive Tooling**:
  - Web search via Tavily MCP for market data and research
  - Step-by-step reasoning via Sequential Thinking MCP for complex analysis
  - File operations via Filesystem MCP for data import/export
  - Weather information lookup
- **Conversation Memory**: Maintains context across multiple turns for complex investment discussions
- **Export Capabilities**: Generate CSV/Excel reports and markdown summaries

## Installation

To install dependencies:

```bash
bun install
```

## Usage

### Interactive CLI Chat

Launch the interactive investment assistant:

```bash
bun run cli
```

**Example Queries:**
- "Calculate my returns if I invest S$1,000 monthly into QQQ for 5 years"
- "Compare fees between investing in US vs HK markets on moomoo"
- "What's the impact of 0.3% FX spread on my USD investments?"
- "Show me a 10-year DCA analysis for my portfolio: QQQ, TLT, and DBS"

**Features:**
- Real-time conversation with context-aware responses
- Short-term memory (remembers conversation history)
- Access to multiple tools:
  - **Web Search**: Research market data, ETF performance, and financial news
  - **Sequential Thinking**: Step-by-step reasoning for complex investment scenarios
  - **File Operations**: Import/export data, read CSV files, generate reports
  - **Weather**: Get current weather information
- Type `exit` or `quit` to exit, or press Ctrl+C

## Supported Instruments

The tool currently supports analysis for the following instruments on moomoo Singapore:

| Ticker | Market | Type | Currency | Description |
|--------|--------|------|----------|-------------|
| QQQ | US (NASDAQ) | ETF | USD | Invesco QQQ Trust (Nasdaq-100) |
| TLT | US (NASDAQ) | ETF | USD | iShares 20+ Year Treasury Bond ETF |
| 03032 | HK (HKEX) | ETF | HKD | CSOP Hang Seng Tech Index ETF |
| DBS (D05.SI) | SG (SGX) | Stock | SGD | DBS Bank |

## Project Structure

```
src/
├── agent/        # Agent initialization and configuration
├── cli/          # Interactive chat interface (Ink-based)
├── provider/     # LLM provider setup (OpenRouter)
├── tools/        # LangChain tools and MCP integrations
│   ├── tavily.ts            # Web search for market data
│   ├── sequential-thinking.ts # Complex reasoning
│   ├── filesystem.ts        # File operations
│   └── weather.ts          # Weather information
└── knowledge/    # Prompts and message helpers

test/             # Test files (using bun:test)
doc/              # Project documentation including PRD
```

## Environment Variables

Create a `.env` file with the following variables:

```bash
OPENROUTER_API_KEY=sk-or-...     # Required for LLM
TAVILY_API_KEY=tvly-...          # Required for web search
DISABLE_THOUGHT_LOGGING=false    # Optional: set to "true" to suppress Sequential Thinking logs
```

See `.env.example` for template.

### Getting API Keys

- **OpenRouter**: Get your API key from [https://openrouter.ai/keys](https://openrouter.ai/keys)
- **Tavily**: Get your API key from [https://app.tavily.com/home](https://app.tavily.com/home)

## Testing

Run all tests:

```bash
bun test
```

Run a specific test file:

```bash
bun test test/tavily.test.ts
```

This project uses the `bun:test` framework for testing.

## MCP Integrations

The agent uses the following MCP (Model Context Protocol) servers:

- **Tavily** (`tavily-mcp@0.1.3`): Web search capabilities
- **Sequential Thinking** (`@modelcontextprotocol/server-sequential-thinking`): Step-by-step reasoning
- **Filesystem** (`@modelcontextprotocol/server-filesystem`): File operations (read, write, edit, search, directory management)

MCP servers run as subprocesses and provide dynamic tool discovery to the agent.

## Technology Stack

- **Runtime**: [Bun](https://bun.com) - Fast all-in-one JavaScript runtime
- **LLM**: Claude Haiku 4.5 via OpenRouter
- **Framework**: LangChain with MCP adapters for tool integration
- **CLI**: Ink (React for CLIs) for interactive interface
- **Testing**: bun:test framework
- **Language**: TypeScript with strict type checking

## Investment Calculation Features

### Fee Modeling (moomoo Singapore)
- **US Market (QQQ, TLT)**: Platform fees, GST (9% on platform fees only), no SEC/TAF on purchases
- **HK Market (03032)**: Commission (0.03%, min HK$3), platform fees (HK$15), GST (9%), trading fees, SFC/AFRC charges, settlement fees, **stamp duty exemption for ETFs**
- **SGX Market (DBS)**: Commission + platform fees (0.03%, min S$0.99 each), clearing (0.0325%), trading (0.0075%), GST (9%)

### FX Spread Modeling
- Configurable FX spread (default 0.30%) for USD/HKD conversions
- Applied per transaction to model real-world currency conversion costs
- Impact analysis on annualized returns

### Return Analysis
- Multi-period projections: 1Y, 3Y, 5Y, 10Y
- Dollar Cost Averaging (DCA) calculations with monthly contributions
- Annualized return calculations including fee drag
- Total return methodology (includes dividend reinvestment)

## Disclaimer

**IMPORTANT**: This tool is for educational and estimation purposes only. It is **NOT** investment advice.

- Historical returns do not guarantee future performance
- Fee schedules and market rules may change - always verify with your broker and exchange
- All calculations are estimates and may differ from actual results
- The tool does not make investment recommendations or provide financial advice
- Always consult with a qualified financial advisor before making investment decisions

## Roadmap

See `doc/llm_投资助手（moomoo_新币定投_费用_收益）prd.md` for detailed feature roadmap including:
- Mode B: Precision IRR calculations with monthly historical data
- Custom instrument library expansion
- Fee schedule versioning and historical snapshots
- Advanced visualization and reporting
- Scenario comparison tools
