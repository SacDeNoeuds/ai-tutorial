import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tmpFolder = path.resolve(__dirname, '../tmp')

export function readTmpFile(fileName: string): string {
  return readFileSync(`${tmpFolder}/${fileName}`, 'utf-8')
}