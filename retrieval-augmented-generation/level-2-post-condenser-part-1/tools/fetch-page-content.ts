import { Readability } from "@mozilla/readability"
import { JSDOM } from "jsdom"
import { tool } from "xsai"
import { z } from "zod"
import { readTmpFile } from '../../utilities/read-tmp-file.js'
import { writeFile } from '../../utilities/write-file.js'

export const fetchPageContentTool = await tool({
  description: "A tool to fetch a page's content from a specified URL",
  name: "fetchPageContent",
  parameters: z.object({
    url: z.string().url().describe("The URL to fetch the content from"),
  }),
  execute: async ({ url }) => {
    // const post = await fetchPageContent(new URL(url))
    console.debug('retrieve post', { url })
    const json = readTmpFile('vasily.cc__blog_facts-dont-change-minds_.json')
    const post = JSON.parse(json)
    console.debug('retrieved post')
    return post.textContent
  },
})

export async function fetchPageContent(url: URL) {
  console.debug("fetching the page content", { url })
  const response = await fetch(url)
  console.debug("parse html")
  const html = await response.text()
  console.debug("new DOM")
  const page = new JSDOM(html, { url: url.href })
  console.debug("new Readability")
  const reader = new Readability(page.window.document)
  console.debug("reader.parse()")
  const post = reader.parse()
  if (!post) throw new Error("Page does not exist", { cause: { url } })

  const { content, textContent, ...post2 } = post
  console.debug("post content", post2)
  writeFile(import.meta, `tmp/${url.hostname}_${url.pathname.replaceAll('/', '_')}.json`, JSON.stringify(post))
  return post
}
