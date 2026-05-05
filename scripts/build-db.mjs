/**
 * Build static database files from cases.json
 *
 * Produces:
 *   public/data/index.json   — lightweight array for listing/search (no fullText)
 *   public/data/cases/*.json — individual case files with full detail
 *
 * Usage: node scripts/build-db.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CASES_SRC = path.join(ROOT, 'src', 'data', 'cases.json')
const DATA_OUT = path.join(ROOT, 'public', 'data')
const CASES_OUT = path.join(DATA_OUT, 'cases')

// Ensure output dirs
fs.mkdirSync(CASES_OUT, { recursive: true })

const cases = JSON.parse(fs.readFileSync(CASES_SRC, 'utf-8'))

// 1. Build the index (no fullText — used for listing and search)
const index = cases.map(({ fullText, ...rest }) => rest)
fs.writeFileSync(path.join(DATA_OUT, 'index.json'), JSON.stringify(index))
console.log(`index.json: ${(JSON.stringify(index).length / 1024).toFixed(0)} KB (${index.length} cases)`)

// 2. Write individual case files (includes fullText excerpt as fallback)
for (const c of cases) {
  fs.writeFileSync(path.join(CASES_OUT, `${c.id}.json`), JSON.stringify(c))
}
console.log(`Individual case files: ${cases.length} written`)

console.log('Done.')
