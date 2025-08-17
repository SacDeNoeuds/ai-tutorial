import { extractReasoning, generateText, message } from "xsai"
import { postCondenserTool } from './tools/post-condenser.js'

const abortController = new AbortController()
const userPrompt =
  "Please provide a condensed version of this blog post, thanks: https://vasily.cc/blog/facts-dont-change-minds/."

const systemPrompt1 = "You are a helping assistant."

const { text: rawText } = await generateText({
  baseURL: "http://127.0.0.1:1234/v1/",
  maxSteps: 2,
  messages: [message.system(systemPrompt1), message.user(userPrompt)],
  model: "qwen/qwen3-1.7b",
  seed: 42,
  // model: "meta-llama-3.1-8b-instruct", // this model is ABSOLUTE SHIT.
  // model: 'mistralai/mistral-nemo-instruct-2407',
  tools: [postCondenserTool],
})
if (!rawText) {
  console.info("No response from the AI")
} else {
  const { reasoning, text } = extractReasoning(rawText)
  if (reasoning)
    console.debug(`Reasoning:\n|  ${reasoning.split("\n").join("\n|  ")}`)

  console.info(text || "No response")
}
console.info("–".repeat(50))

process.on("SIGTERM", () => {
  abortController.abort()
})
process.exit(0)
