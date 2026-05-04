import { Document } from 'flexsearch'
import type { LegalCase, AutocompleteSuggestion } from '../types/case'

let docIndex: InstanceType<typeof Document> | null = null
let casesMap: Map<string, LegalCase> = new Map()
let allCases: LegalCase[] = []
let allTopics: string[] = []
let allPonentes: string[] = []
let allStatutes: string[] = []

export function initSearchEngine(cases: LegalCase[]) {
  allCases = cases
  casesMap = new Map(cases.map(c => [c.id, c]))

  const topicSet = new Set<string>()
  const ponenteSet = new Set<string>()
  const statuteSet = new Set<string>()
  for (const c of cases) {
    c.topics.forEach(t => topicSet.add(t))
    ponenteSet.add(c.ponente)
    c.citedStatutes.forEach(s => statuteSet.add(s))
  }
  allTopics = [...topicSet].sort()
  allPonentes = [...ponenteSet].sort()
  allStatutes = [...statuteSet].sort()

  docIndex = new Document({
    document: {
      id: 'id',
      index: [
        { field: 'title', tokenize: 'forward' },
        { field: 'grNumber', tokenize: 'full' },
        { field: 'summary', tokenize: 'forward' },
        { field: 'doctrine', tokenize: 'forward' },
        { field: 'ponente', tokenize: 'forward' },
        { field: 'topicsStr', tokenize: 'forward' },
        { field: 'statutesStr', tokenize: 'full' },
      ],
    },
  })

  for (const c of cases) {
    docIndex.add({
      id: c.id,
      title: c.title,
      grNumber: c.grNumber,
      summary: c.summary,
      doctrine: c.doctrine,
      ponente: c.ponente,
      topicsStr: c.topics.join(' '),
      statutesStr: c.citedStatutes.join(' '),
    })
  }
}

export function search(query: string, limit = 20): LegalCase[] {
  if (!docIndex || !query.trim()) return []

  const q = query.trim()

  // Strategy: search each word individually and intersect/union results
  // This handles multi-word queries much better than phrase search
  const words = q.split(/\s+/).filter(w => w.length >= 2)

  if (words.length === 0) return []

  // First try the full query as-is
  const fullResults = searchRaw(q, limit)

  // Then search each word individually and score by how many words matched
  const wordHits = new Map<string, number>() // id -> match count
  for (const word of words) {
    const hits = searchRaw(word, 50)
    for (const c of hits) {
      wordHits.set(c.id, (wordHits.get(c.id) || 0) + 1)
    }
  }

  // Also do a fallback fuzzy match on title and summary for short queries
  if (q.length >= 3) {
    const lower = q.toLowerCase()
    for (const c of allCases) {
      if (
        c.title.toLowerCase().includes(lower) ||
        c.summary.toLowerCase().includes(lower) ||
        c.doctrine.toLowerCase().includes(lower) ||
        c.topics.some(t => t.toLowerCase().includes(lower)) ||
        c.citedStatutes.some(s => s.toLowerCase().includes(lower))
      ) {
        wordHits.set(c.id, (wordHits.get(c.id) || 0) + words.length) // boost direct matches
      }
    }
  }

  // Merge: full-query results first (highest relevance), then by word-hit count
  const seen = new Set<string>()
  const results: LegalCase[] = []

  // Full query matches first
  for (const c of fullResults) {
    if (!seen.has(c.id)) {
      seen.add(c.id)
      results.push(c)
    }
  }

  // Then word-hit results sorted by match count (descending)
  const wordSorted = [...wordHits.entries()]
    .filter(([id]) => !seen.has(id))
    .sort((a, b) => b[1] - a[1])

  for (const [id] of wordSorted) {
    const c = casesMap.get(id)
    if (c) {
      seen.add(id)
      results.push(c)
    }
  }

  return results.slice(0, limit)
}

function searchRaw(query: string, limit: number): LegalCase[] {
  if (!docIndex) return []
  const raw = docIndex.search(query, { limit })
  const seen = new Set<string>()
  const results: LegalCase[] = []
  for (const fieldResult of raw) {
    for (const id of fieldResult.result) {
      const strId = String(id)
      if (!seen.has(strId)) {
        seen.add(strId)
        const c = casesMap.get(strId)
        if (c) results.push(c)
      }
    }
  }
  return results
}

export function getAutocompleteSuggestions(query: string): AutocompleteSuggestion[] {
  if (!query.trim() || query.length < 2) return []

  const q = query.toLowerCase()
  const suggestions: AutocompleteSuggestion[] = []

  // Match case titles
  const caseSuggestions: AutocompleteSuggestion[] = []
  for (const [id, c] of casesMap) {
    if (c.title.toLowerCase().includes(q) || c.grNumber.toLowerCase().includes(q)) {
      caseSuggestions.push({ text: c.title, type: 'case', caseId: id })
    }
    if (caseSuggestions.length >= 5) break
  }
  suggestions.push(...caseSuggestions)

  // Match topics
  let topicCount = 0
  for (const t of allTopics) {
    if (t.toLowerCase().includes(q)) {
      suggestions.push({ text: t, type: 'topic' })
      topicCount++
    }
    if (topicCount >= 3) break
  }

  // Match ponentes
  let ponenteCount = 0
  for (const p of allPonentes) {
    if (p.toLowerCase().includes(q)) {
      suggestions.push({ text: p, type: 'ponente' })
      ponenteCount++
    }
    if (ponenteCount >= 3) break
  }

  // Match statutes
  let statuteCount = 0
  for (const s of allStatutes) {
    if (s.toLowerCase().includes(q)) {
      suggestions.push({ text: s, type: 'statute' })
      statuteCount++
    }
    if (statuteCount >= 3) break
  }

  return suggestions.slice(0, 10)
}
