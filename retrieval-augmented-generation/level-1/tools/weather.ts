import { tool } from "xsai"
import { z } from "zod"

export const weather = await tool({
  description: "A tool to get the weather for a certain location",
  name: "weather",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: ({ location }) => {
    console.debug("getting the weather", { location })
    return JSON.stringify({
      location,
      temperature: 25,
      unit: "degrees",
    })
  },
})
