export interface LegalCase {
  id: string
  title: string
  grNumber: string
  date: string
  court: string
  ponente: string
  petitioner: string
  respondent: string
  topics: string[]
  summary: string
  doctrine: string
  citedStatutes: string[]
  relatedCases: string[]
  fullText: string
  sourceUrl?: string
  hasFullDecision?: boolean
}

export interface SearchResult {
  case: LegalCase
  score: number
  matchedField?: string
}

export interface AutocompleteSuggestion {
  text: string
  type: 'case' | 'statute' | 'topic' | 'ponente'
  caseId?: string
}
