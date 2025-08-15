import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function writeFile(meta: ImportMeta, relativePath: string, content: string) {
  const __filename = fileURLToPath(meta.url)
  const __dirname = path.dirname(__filename)
  const filePath = path.resolve(__dirname, relativePath)

  console.debug("write file", filePath)
  fs.writeFileSync(filePath, content, "utf-8")
  return { filePath }
}