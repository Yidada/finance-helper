import { describe, expect, test } from "bun:test";
import { getWeather } from "../src/tools/weather";
import { ToolInputParsingException } from "@langchain/core/tools";

describe("getWeather tool", () => {
  test("returns a sunny message for a provided city", async () => {
    const result = await getWeather.invoke({ city: "Tokyo" });

    expect(result).toBe("It's always sunny in Tokyo!");
  });

  test("throws when required schema fields are missing", async () => {
    await expect(getWeather.invoke({} as unknown as { city: string })).rejects.toBeInstanceOf(ToolInputParsingException);
  });
});
