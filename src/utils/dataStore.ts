import type { LegalCase } from '../types/case'

const BASE = import.meta.env.BASE_URL || '/'

export type CaseIndex = Omit<LegalCase, 'fullText'>

let cachedIndex: CaseIndex[] | null = null
const caseCache = new Map<string, LegalCase>()

export async function loadIndex(): Promise<CaseIndex[]> {
  if (cachedIndex) return cachedIndex
  const res = await fetch(`${BASE}data/index.json`)
  cachedIndex = await res.json()
  return cachedIndex!
}

export async function loadCase(id: string): Promise<LegalCase | null> {
  if (caseCache.has(id)) return caseCache.get(id)!
  try {
    const res = await fetch(`${BASE}data/cases/${id}.json`)
    if (!res.ok) return null
    const data: LegalCase = await res.json()
    caseCache.set(id, data)
    return data
  } catch {
    return null
  }
}

export async function loadFullDecision(id: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}decisions/${id}.txt`)
    if (!res.ok) return null
    return res.text()
  } catch {
    return null
  }
}

export function getIndex(): CaseIndex[] {
  return cachedIndex || []
}
