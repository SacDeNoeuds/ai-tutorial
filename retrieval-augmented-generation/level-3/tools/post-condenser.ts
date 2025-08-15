import { extractReasoning, generateText, message, tool } from "xsai"
import { z } from "zod"
import { writeFile } from "../../utilities/write-file.js"
import { readPostContentFromCache } from "./fetch-page-content.js"

const systemPrompt = `
You are a text condenser expert, making texts more concise without losing any bit of valuable information and re-shaping the reasoning structure *if need be*.
The user will copy-paste a blog post content, your job is to generate a condensed post content.
`.trim()

export const postCondenserTool = await tool({
  name: "postCondenser",
  description: "A tool to condense a blog post",
  parameters: z.object({
    url: z.string().url().describe("The URL of the blog post to condense"),
  }),
  execute: async (input) => {
    const url = new URL(input.url)
    const post = readPostContentFromCache()
    const { text: rawText } = await generateText({
      baseURL: "http://127.0.0.1:1234/v1/",
      maxSteps: 1,
      messages: [message.system(systemPrompt), message.user(post.content)],
      seed: 42,
      // model: "qwen/qwen3-1.7b",
      model: "google/gemma-3-12b",
      // model: "meta-llama-3.1-8b-instruct", // this model is ABSOLUTE SHIT, it only wants to code and is shit at calling tools.
      // model: 'mistralai/mistral-nemo-instruct-2407',
    })

    const { reasoning, text } = extractReasoning(rawText ?? "")
    // if (reasoning) console.debug(`Reasoning:\n${reasoning}\n---`)
    // console.info(text)
    // console.info("---")
    const footer = `Source: [${url.host}](${url.href})`
    const content = [text, footer].join("\n\n---\n\n")

    const fileName = `${url.hostname}_${url.pathname.replaceAll("/", "_")}`
    const relativePath = `../summaries/${fileName}.md`
    const filePath = writeFile(import.meta, relativePath, content)
    return JSON.stringify({ filePath })
  },
})
