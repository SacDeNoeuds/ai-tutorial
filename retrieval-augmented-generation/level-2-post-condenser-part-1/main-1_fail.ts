import { extractReasoning, generateText, message } from "xsai"
import { fetchPageContentTool } from "./tools/fetch-page-content.js"

const abortController = new AbortController()
const userPrompt =
  "Please summarize this blog post: https://vasily.cc/blog/facts-dont-change-minds/, thanks !"

const systemPrompt1 = [
  "Humans tend to be quite verbose and sometimes have a clumsy path of thought or poor writing style.",
  "You are an expert in making texts more concise, condensing texts without losing any bit of valuable information and re-shaping the reasoning structure *if need be*.",
  "You must keep every detail, your job is *only to make a text more concise*.",
  "Once you are done, write a markdown file {slugified-url}.md with your summary and notify the user where you’ve written the file.",
].join(" ")
const systemPrompt2 = [
  "Humans tend to be quite verbose and sometimes have a clumsy path of thought.",
  "You are an expert in making texts concise, condensing texts to their essence without losing any bit of valuable information, and re-shaping the reasoning structure *if need be*.",
  "You must keep every detail, your job is *only to make a text more concise*.",
  "Which means that you _may_ output a long text, the only requirement is that text to be shorter than the original one.",
  "Once you are done, write a markdown file {slugified-url}.md with your summary and notify the user where you’ve written the file."
].join(' ')
const systemPrompt3 = [
  "Humans tend to be quite verbose and sometimes have a clumsy path of thought or poor writing style.",
  "You are a text condenser expert, making texts more concise without losing any bit of valuable information and re-shaping the reasoning structure *if need be*.",
  "Your job is to condense the blog post, then add a summary as introduction.",
  "Write a markdown file containing the summary and condensed post content.",
  "Notify the user that you are done where you have written the file.",
].join(" ")

const { text: rawText } = await generateText({
  baseURL: "http://127.0.0.1:1234/v1/",
  maxSteps: 2,
  messages: [message.system(systemPrompt1), message.user(userPrompt)],
  // model: "qwen/qwen3-1.7b",
  // model: "meta-llama-3.1-8b-instruct", // this model is ABSOLUTE SHIT.
  model: 'mistralai/mistral-nemo-instruct-2407',
  tools: [fetchPageContentTool],
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
