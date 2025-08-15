import { extractReasoning, generateText, message } from 'xsai'
import { readTmpFile } from '../utilities/read-tmp-file.js'

const json = readTmpFile('vasily.cc__blog_facts-dont-change-minds_.json')
const post = JSON.parse(json)
const postContent = post.textContent.trim()
console.debug('post length', post.textContent.length)
console.debug('----------')
console.debug(postContent)
console.debug('----------')

const systemPrompt = [
  "You are a text condenser expert, making texts more concise without losing any bit of valuable information and re-shaping the reasoning structure *if need be*.",
  "The user will copy-paste a blog post content, your job is to generate a condensed post content.",
].join(" ")

const { text: rawText, messages, ...rest } = await generateText({
  baseURL: "http://127.0.0.1:1234/v1/",
  maxSteps: 1,
  messages: [message.system(systemPrompt), message.user(postContent)],
  seed: 42,
  // model: "qwen/qwen3-1.7b",
  model: "google/gemma-3-12b",
  // model: "meta-llama-3.1-8b-instruct", // this model is ABSOLUTE SHIT, it only wants to code and is shit at calling tools.
  // model: 'mistralai/mistral-nemo-instruct-2407',
})

console.debug(rest)
console.debug('---')
// console.info(object.postContentInMarkdown)
const { reasoning, text } = extractReasoning(rawText ?? '')
if (reasoning) console.debug(`Reasoning:\n${reasoning}\n---`)
console.info(text)
console.info('–'.repeat(75))
