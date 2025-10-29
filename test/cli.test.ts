import { describe, expect, test } from "bun:test";

/**
 * CLI Integration Tests
 *
 * These tests validate the CLI structure and imports without requiring a TTY.
 * Actual interactive testing requires manual testing in a terminal.
 */

describe("CLI Interactive Chat", () => {
  test("CLI file exists and has valid TypeScript", async () => {
    const cliPath = "./src/cli/index.tsx";
    const file = Bun.file(cliPath);
    const exists = await file.exists();
    expect(exists).toBe(true);

    const content = await file.text();

    // Check for key imports
    expect(content).toContain("import React");
    expect(content).toContain("from \"ink\"");
    expect(content).toContain("from \"ink-text-input\"");
    expect(content).toContain("from \"../agent/index.js\"");

    // Check for key functionality
    expect(content).toContain("InteractiveChat");
    expect(content).toContain("useState");
    expect(content).toContain("handleSubmit");
    expect(content).toContain("TextInput");
  });

  test("Example file exists", async () => {
    const examplePath = "./examples/interactive-chat.ts";
    const file = Bun.file(examplePath);
    const exists = await file.exists();
    expect(exists).toBe(true);

    const content = await file.text();
    expect(content).toContain("import \"../src/cli/index.js\"");
  });

  test("package.json has CLI scripts", async () => {
    const packageJson = await Bun.file("./package.json").json();
    expect(packageJson.scripts).toHaveProperty("example:chat");
    expect(packageJson.scripts).toHaveProperty("cli");
    expect(packageJson.scripts["example:chat"]).toBe("bun examples/interactive-chat.ts");
    expect(packageJson.scripts["cli"]).toBe("bun src/cli/index.tsx");
  });

  test("ink-text-input is installed", async () => {
    const packageJson = await Bun.file("./package.json").json();
    expect(packageJson.dependencies).toHaveProperty("ink-text-input");
  });
});
