import { Readability } from "@mozilla/readability"
import { JSDOM } from "jsdom"
import { readTmpFile } from "../../utilities/read-tmp-file.js"
import { writeFile } from "../../utilities/write-file.js"

export function readPostContentFromCache() {
  const json = readTmpFile("vasily.cc__blog_facts-dont-change-minds_.json")
  const post = JSON.parse(json)
  console.debug("retrieved post", { length: post.textContent.length })
  return { content: post.textContent as string }
}

// TODO: implement a proper cache.
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
  writeFile(
    import.meta,
    `tmp/${url.hostname}_${url.pathname.replaceAll("/", "_")}.json`,
    JSON.stringify(post),
  )
  return post
}
