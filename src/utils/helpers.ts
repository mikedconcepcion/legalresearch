import type { LegalCase } from '../types/case'

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatCitation(c: LegalCase): string {
  return `${c.title}, ${c.grNumber}, ${formatDate(c.date)} (${c.court})`
}

export function getTopicCounts(cases: LegalCase[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const c of cases) {
    for (const t of c.topics) {
      counts.set(t, (counts.get(t) || 0) + 1)
    }
  }
  return new Map([...counts.entries()].sort((a, b) => b[1] - a[1]))
}

export function getCourtCounts(cases: LegalCase[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const c of cases) {
    counts.set(c.court, (counts.get(c.court) || 0) + 1)
  }
  return new Map([...counts.entries()].sort((a, b) => b[1] - a[1]))
}

export function getYearRange(cases: LegalCase[]): [number, number] {
  const years = cases.map(c => new Date(c.date).getFullYear())
  return [Math.min(...years), Math.max(...years)]
}

export function highlightText(text: string, query: string): { parts: { text: string; highlight: boolean }[] } {
  if (!query.trim()) return { parts: [{ text, highlight: false }] }

  const words = query.trim().split(/\s+/).filter(w => w.length >= 2)
  if (words.length === 0) return { parts: [{ text, highlight: false }] }

  const pattern = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  const parts: { text: string; highlight: boolean }[] = []
  let lastIndex = 0

  text.replace(pattern, (match, _p1, offset) => {
    if (offset > lastIndex) {
      parts.push({ text: text.slice(lastIndex, offset), highlight: false })
    }
    parts.push({ text: match, highlight: true })
    lastIndex = offset + match.length
    return match
  })

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false })
  }

  return { parts: parts.length > 0 ? parts : [{ text, highlight: false }] }
}
