import * as z from "zod";
import { tool } from "langchain";

export const getWeather = tool(({ city }) => `It's always sunny in ${city}!`, {
  name: "get_weather",
  description: "Get the weather for a given city",
  schema: z.object({
    city: z.string().describe("The name of the city to get weather for"),
  }),
});
