import { useState, useEffect, useRef, useCallback } from 'react'
import type { LegalCase, AutocompleteSuggestion } from '../types/case'
import { search, getAutocompleteSuggestions } from '../utils/searchEngine'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<LegalCase[]>([])
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSuggestions([])
      setIsSearching(false)
      return
    }

    // Immediate autocomplete suggestions
    setSuggestions(getAutocompleteSuggestions(query))

    // Debounced full search
    clearTimeout(timerRef.current)
    setIsSearching(true)
    timerRef.current = setTimeout(() => {
      setResults(search(query))
      setIsSearching(false)
    }, 150)

    return () => clearTimeout(timerRef.current)
  }, [query])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setSuggestions([])
  }, [])

  return { query, setQuery, results, suggestions, isSearching, clearSearch }
}
