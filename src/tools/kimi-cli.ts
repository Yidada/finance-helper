import * as z from "zod";
import { tool } from "langchain";
import { $ } from "bun";

/**
 * Kimi CLI Tool
 *
 * Delegates complex terminal operations to Kimi CLI agent
 * Requires: `uv tool install --python 3.13 kimi-cli`
 *
 * This tool allows the agent to leverage Kimi's specialized CLI capabilities
 * for executing and reasoning about terminal commands.
 */
export const kimiCli = tool(
  async ({ prompt }: { prompt: string }) => {
    try {
      // Check if kimi is installed
      const checkResult = await $`which kimi`.quiet().nothrow();

      if (checkResult.exitCode !== 0) {
        return `Error: Kimi CLI is not installed. Please install it first:
  uv tool install --python 3.13 kimi-cli

After installation, the 'kimi' command will be available.`;
      }

      // Execute kimi with the prompt in non-interactive mode
      // Using echo to pipe the prompt to kimi
      const result =
        await $`echo ${prompt} | kimi --non-interactive`.quiet().nothrow();

      if (result.exitCode !== 0) {
        return `Kimi CLI error (exit code ${result.exitCode}):
${result.stderr.toString()}

Note: Kimi CLI may not support fully non-interactive mode. For complex operations,
consider breaking down the task into simpler shell commands or using other tools.`;
      }

      const output = result.stdout.toString();
      return output || "Kimi CLI executed successfully with no output.";
    } catch (error) {
      return `Error executing Kimi CLI: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "kimi_cli",
    description: `Execute complex terminal operations using Kimi CLI agent.
Use this tool when you need to:
- Perform multi-step terminal operations
- Execute commands that require context-aware reasoning
- Get AI assistance with shell scripting or system administration tasks

The prompt should describe what you want to accomplish in the terminal.
Note: Kimi CLI must be installed first: uv tool install --python 3.13 kimi-cli`,
    schema: z.object({
      prompt: z
        .string()
        .describe(
          "The task description or question to send to Kimi CLI agent"
        ),
    }),
  }
);
