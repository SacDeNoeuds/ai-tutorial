import { stdin, stdout } from "node:process"
import readline from "node:readline/promises"
import { generateText, message } from "xsai"
import { weather } from "./tools/weather.js"

const rl = readline.createInterface({ input: stdin, output: stdout })

const abortController = new AbortController()
let userPrompt = ""

while (userPrompt !== "q") {
  userPrompt = await rl.question("Ask anything? (q to exit) ")
  if (userPrompt === "q") continue
  const { text } = await generateText({
    baseURL: "http://127.0.0.1:1234/v1/",
    maxSteps: 2,
    messages: [
      message.system("You are a helpful assistant."),
      message.user(userPrompt),
    ],
    model: "qwen/qwen3-1.7b",
    tools: [weather],
  })
  console.info(text)
}

process.on("SIGTERM", () => {
  abortController.abort()
})
process.exit(0)
