/**
 * LawPhil Full-Text Scraper
 *
 * Fetches full decision texts from lawphil.net for cases in cases.json.
 * Saves cleaned text to public/decisions/{id}.txt
 * Updates cases.json with sourceUrl and hasFullDecision fields.
 *
 * Usage: node scripts/scrape-lawphil.mjs [--force] [--case <id>]
 *   --force   Re-fetch even if file exists
 *   --case    Only fetch a specific case ID
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CASES_PATH = path.join(ROOT, 'src', 'data', 'cases.json')
const DECISIONS_DIR = path.join(ROOT, 'public', 'decisions')

// Map of case IDs to their LawPhil URL paths
// Format: https://lawphil.net/judjuris/juri{YEAR}/{month}{YEAR}/gr_{number}_{YEAR}.html
const LAWPHIL_URLS = {
  'gr-l-45081-1936': 'juri1936/jul1936/gr_45081_1936.html',
  'gr-14639-1919': 'juri1919/mar1919/gr_14639_1919.html',
  'gr-88211-1989': 'juri1989/sep1989/gr_88211_1989.html',
  'gr-100710-1991': 'juri1991/jan1991/gr_81561_1991.html',
  'gr-101083-1993': 'juri1993/jul1993/gr_101083_1993.html',
  'gr-148560-2001': 'juri2001/nov2001/gr_148560_2001.html',
  'gr-171396-2006': 'juri2006/may2006/gr_171396_2006.html',
  'gr-152154-2003': 'juri2003/jul2003/gr_152154_2003.html',
  'gr-122156-1997': 'juri1997/feb1997/gr_122156_1997.html',
  'gr-l-68379-1986': 'juri1986/apr1986/gr_l-63915_1986.html',
  'gr-175-1909': null, // US Supreme Court decision, not on LawPhil
  'gr-132601-1999': 'juri1999/feb1999/gr_117472_1999.html',
  'gr-173034-2007': 'juri2007/oct2007/gr_173034_2007.html',
  'gr-204819-2014': 'juri2014/apr2014/gr_204819_2014.html',
  'gr-208566-2013': 'juri2013/nov2013/gr_208566_2013.html',
  'gr-l-34150-1970': 'juri2014/sep2014/gr_211356_2014.html',
  'gr-148211-2002': 'juri2002/apr2002/gr_151445_2002.html',
  'gr-159618-2004': 'juri2003/nov2003/gr_160261_2003.html',
  'gr-177721-2007': 'juri2005/jan2005/gr_160258_2005.html',
  'gr-143568-2003': 'juri1997/feb1997/gr_108763_1997.html',
  'gr-146710-2001': 'juri2001/mar2001/gr_146710_2001.html',
  'gr-168338-2006': 'juri2009/mar2009/gr_167614_2009.html',
  'gr-120905-1997': 'juri2004/nov2004/gr_158693_2004.html',
  'gr-l-22301-1966': 'juri1919/mar1919/gr_l-14078_1919.html',
  'gr-176951-2008': 'juri2007/jan2007/gr_153675_2007.html',
  'gr-l-32432-1970': 'juri1967/jul1967/gr_l-24693_1967.html',
  'gr-191002-2010': 'juri2014/feb2014/gr_203335_2014.html',
  'gr-124360-1997': 'juri2009/jan2009/gr_122846_2009.html',
  'gr-l-44640-1979': 'juri1973/mar1973/gr_l-36142_1973.html',
  'gr-l-9871-1957': 'juri1939/may1939/gr_45987_1939.html',
  'gr-159796-2004': 'juri2008/feb2008/gr_168338_2008.html',
  'gr-133250-1999': 'juri2006/aug2006/gr_130974_2006.html',
  'gr-178552-2009': 'juri2014/jul2014/gr_209287_2014.html',
  'gr-170516-2006': null, // Composite case reference
  'gr-115455-1998': 'juri1998/apr1998/gr_115349_1998.html',
  'gr-180643-2009': 'juri2010/mar2010/gr_160756_2010.html',
  'gr-133064-1999': 'juri2008/mar2008/gr_178552_2008.html',
  'gr-179271-2009': 'juri2009/apr2009/gr_179271_2009.html',
  'gr-127325-1997': 'juri1989/jul1989/gr_78742_1989.html',
  'gr-190529-2011': null, // Check URL
  'gr-148571-2002': 'juri2011/jun2011/gr_167933_2011.html',
  'gr-162571-2004': 'juri1996/mar1996/gr_119599_1996.html',
  'gr-166429-2006': 'juri2000/jul2000/gr_132988_2000.html',
  'gr-l-17474-1962': 'juri1940/dec1940/gr_47800_1940.html',
  'gr-148334-2002': null, // 1916 case, may not be on LawPhil
  'gr-l-36142-1973b': 'juri2008/aug2008/gr_166715_2008.html',
  'gr-125948-1999': 'juri1965/jun1965/gr_l-19201_1965.html',
  'gr-148408-2002': 'juri2011/sep2011/gr_179987_2011.html',
  'gr-179267-2009': 'juri1949/aug1949/gr_l-2044_1949.html',
  'gr-l-21064-1966': 'juri1937/nov1937/gr_45685_1937.html',
  'gr-202242-2013': 'juri2018/may2018/gr_237428_2018.html',
  'gr-191938-2011': 'juri2010/apr2010/gr_190582_2010.html',
  'gr-189698-2010': 'juri2013/apr2013/gr_203766_2013.html',
  'gr-180050-2008': 'juri2007/may2007/gr_177271_2007.html',
  'gr-167011-2005': 'juri1998/oct1998/gr_118712_1998.html',
  'gr-183591-2009': 'juri2014/apr2014/gr_183591_2014.html',
  'gr-195432-2012': 'juri2009/feb2009/gr_179546_2009.html',
  'gr-187698-2010': 'juri2005/mar2005/gr_151378_2005.html',
  'gr-181613-2009': 'juri1990/feb1990/gr_l-48494_1990.html',
  'gr-164527-2006': 'juri2005/jun2005/gr_145271_2005.html',
  'gr-155001-2004': 'juri2006/mar2006/gr_159938_2006.html',
  'gr-170405-2007': 'juri2003/aug2003/gr_148222_2003.html',
  'gr-161135-2005': 'juri1997/jan1997/gr_116181_1997.html',
  'gr-173915-2008': 'juri2003/jan2003/gr_136202_2003.html',
  'gr-158867-2005': 'juri1992/jul1992/gr_92383_1992.html',
  'gr-152016-2003': 'juri2005/jul2005/gr_154514_2005.html',
  'gr-154740-2004': 'juri1994/nov1994/gr_108555_1994.html',
  'gr-168523-2007': 'juri2005/sep2005/gr_141524_2005.html',
  'gr-145804-2002': 'juri2008/mar2008/gr_180643_2008.html',
  'gr-175723-2008': 'juri2021/mar2021/gr_220017_2021.html',
  'gr-166471-2006': null, // 1966 case, old format
  'gr-l-68470-1986': 'juri1980/jan1980/gr_l-52245_1980.html',
  'gr-179830-2009': 'juri2006/nov2006/gr_157294_2006.html',
  'gr-l-31195-1971': 'juri1987/mar1987/gr_74457_1987.html',
  // New batch
  'gr-127444-1997': null, // 1989, URL pattern uncertain
  'gr-178300-2008': 'juri2006/jul2006/gr_164577_2006.html',
  'gr-166401-2006': null, // 1922 case
  'gr-176389-2008': 'juri2016/apr2016/gr_202124_2016.html',
  'gr-160188-2004': 'juri2006/sep2006/gr_167693_2006.html',
  'gr-192935-2011': 'juri2015/jun2015/gr_194239_2015.html',
  'gr-206510-2014': 'juri2015/apr2015/gr_180771_2015.html',
  'gr-207257-2014': 'juri2014/jan2014/gr_172896_2014.html',
  'gr-185379-2010': null, // 1995, URL pattern uncertain
  'gr-195670-2012': 'juri2003/feb2003/gr_142396_2003.html',
  'gr-159085-2004': 'juri1991/feb1991/gr_86773_1991.html',
  'gr-181559-2009': 'juri2005/may2005/gr_154674_2005.html',
  'gr-177857-2008': null, // 1940 case
  'gr-187167-2010': 'juri2014/feb2014/gr_204429_2014.html',
  'gr-186421-2010': 'juri2005/nov2005/gr_156236_2005.html',
  'gr-193707-2011': null, // 2018, check URL
  'gr-163437-2005': 'juri2006/jan2006/gr_169131_2006.html',
  'gr-170452-2007': 'juri2014/apr2014/gr_193415_2014.html',
  'gr-171101-2007': 'juri2013/aug2013/gr_189871_2013.html',
  'gr-178546-2009': null, // 2005, URL uncertain
  'gr-189405-2010': 'juri2007/feb2007/gr_171557_2007.html',
  'gr-181249-2009': 'juri2008/dec2008/gr_171947_2008.html',
  'gr-182380-2009': 'juri2013/feb2013/gr_187485_2013.html',
  'gr-165109-2006': 'juri2001/jul2001/gr_135210_2001.html',
  'gr-168056-2007': null, // 1996, URL uncertain
}

const LAWPHIL_BASE = 'https://lawphil.net/judjuris/'

// Rate limit: 1 request per 2 seconds to be respectful
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Strip HTML tags and clean up text from LawPhil pages
function cleanHtml(html) {
  // Remove script/style tags and content
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

  // Extract the blockquote content (where LawPhil puts the decision)
  const bqMatch = text.match(/<blockquote[^>]*>([\s\S]*)<\/blockquote>/i)
  if (bqMatch) text = bqMatch[1]

  // Remove the navigation link bar at the top (e.g., "Decision, Perlas-Bernabe [J]...")
  // These are typically in the first <p> or before the first <hr>
  const hrIdx = text.indexOf('<hr')
  if (hrIdx >= 0 && hrIdx < 500) {
    text = text.substring(hrIdx)
    // Also skip past the <hr> tag itself
    text = text.replace(/^<hr[^>]*>/, '')
  }

  // Remove gcse and other widget tags
  text = text.replace(/<gcse:[^>]*>[\s\S]*?<\/gcse:[^>]*>/gi, '')
  text = text.replace(/<gcse:[^>]*\/?>/gi, '')

  // --- Block-level elements: insert paragraph breaks ---
  // <p> tags = paragraph breaks
  text = text.replace(/<p[^>]*>/gi, '\n\n')
  text = text.replace(/<\/p>/gi, '\n\n')
  // <br> = single line break
  text = text.replace(/<br\s*\/?>/gi, '\n')
  // Headings
  text = text.replace(/<\/h[1-6]>/gi, '\n\n')
  text = text.replace(/<h[1-6][^>]*>/gi, '\n\n')
  // Divs, table cells = paragraph breaks
  text = text.replace(/<\/div>/gi, '\n\n')
  text = text.replace(/<div[^>]*>/gi, '\n')
  text = text.replace(/<\/td>/gi, '\n')
  text = text.replace(/<\/tr>/gi, '\n')
  // Blockquotes
  text = text.replace(/<blockquote[^>]*>/gi, '\n\n')
  text = text.replace(/<\/blockquote>/gi, '\n\n')
  // Lists
  text = text.replace(/<li[^>]*>/gi, '\n')
  text = text.replace(/<\/li>/gi, '')
  text = text.replace(/<\/?[ou]l[^>]*>/gi, '\n')
  // Horizontal rules = section breaks
  text = text.replace(/<hr[^>]*>/gi, '\n\n---\n\n')

  // --- Inline elements: just remove ---
  text = text.replace(/<\/?(?:em|i|b|strong|u|font|span|a|center|img|sup|sub|small|big|tt)[^>]*>/gi, '')

  // Remove footnote superscript content (numbers in sup tags already removed above)
  // Remove remaining tags
  text = text.replace(/<[^>]+>/g, '')

  // --- Decode HTML entities ---
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#39;/g, "'")
  text = text.replace(/&mdash;/g, '—')
  text = text.replace(/&ndash;/g, '–')
  text = text.replace(/&ldquo;/g, '\u201c')
  text = text.replace(/&rdquo;/g, '\u201d')
  text = text.replace(/&lsquo;/g, '\u2018')
  text = text.replace(/&rsquo;/g, '\u2019')
  text = text.replace(/&sect;/g, '\u00A7')
  text = text.replace(/&para;/g, '\u00B6')
  text = text.replace(/&#(\d+);/g, (_, n) => {
    const code = parseInt(n)
    return code > 31 && code < 127 ? String.fromCharCode(code) : ''
  })
  text = text.replace(/&[a-z]+;/gi, '') // Remove any remaining entities

  // --- Clean up whitespace ---
  text = text.replace(/\t/g, '    ')         // Tabs to spaces
  text = text.replace(/[ ]+/g, ' ')          // Collapse spaces (but keep newlines)
  text = text.replace(/ \n/g, '\n')          // Remove trailing spaces
  text = text.replace(/\n /g, '\n')          // Remove leading spaces on lines
  text = text.replace(/\n{4,}/g, '\n\n\n')   // Max 3 newlines (paragraph + extra)
  text = text.replace(/^\n+/, '')            // Remove leading newlines
  text = text.trim()

  // Remove common LawPhil footer text
  text = text.replace(/The Lawphil Project[\s\S]*$/i, '').trim()
  text = text.replace(/\n*Arellano Law Foundation[\s\S]*$/i, '').trim()

  return text
}

async function fetchDecision(caseId, urlPath) {
  const url = LAWPHIL_BASE + urlPath
  console.log(`  Fetching: ${url}`)

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.log(`  ✗ HTTP ${res.status}`)
      return null
    }
    const html = await res.text()
    const text = cleanHtml(html)

    if (text.length < 500) {
      console.log(`  ✗ Too short (${text.length} chars), likely not a decision`)
      return null
    }

    console.log(`  ✓ ${text.length} chars`)
    return text
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`)
    return null
  }
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const caseIdx = args.indexOf('--case')
  const onlyCase = caseIdx >= 0 ? args[caseIdx + 1] : null

  // Ensure output directory exists
  fs.mkdirSync(DECISIONS_DIR, { recursive: true })

  const cases = JSON.parse(fs.readFileSync(CASES_PATH, 'utf-8'))
  let fetched = 0
  let skipped = 0
  let failed = 0

  for (const c of cases) {
    if (onlyCase && c.id !== onlyCase) continue

    const urlPath = LAWPHIL_URLS[c.id]
    const outFile = path.join(DECISIONS_DIR, `${c.id}.txt`)

    // Skip if no URL mapped
    if (!urlPath) {
      console.log(`⊘ ${c.id} — no LawPhil URL mapped`)
      skipped++
      continue
    }

    // Skip if already fetched (unless --force)
    if (!force && fs.existsSync(outFile)) {
      console.log(`✓ ${c.id} — already exists`)
      skipped++
      continue
    }

    console.log(`→ ${c.id} (${c.title})`)
    const text = await fetchDecision(c.id, urlPath)

    if (text) {
      fs.writeFileSync(outFile, text, 'utf-8')

      // Update case entry
      c.sourceUrl = LAWPHIL_BASE + urlPath
      c.hasFullDecision = true
      fetched++
    } else {
      failed++
    }

    // Rate limit
    await sleep(2000)
  }

  // Write updated cases.json
  fs.writeFileSync(CASES_PATH, JSON.stringify(cases, null, 2), 'utf-8')

  console.log(`\nDone: ${fetched} fetched, ${skipped} skipped, ${failed} failed`)
}

main().catch(console.error)
