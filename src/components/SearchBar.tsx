import { useState, useRef, useEffect } from 'react'
import type { AutocompleteSuggestion } from '../types/case'

const TYPE_LABELS: Record<string, string> = {
  case: 'Case',
  topic: 'Topic',
  ponente: 'Justice',
  statute: 'Statute',
}

const TYPE_COLORS: Record<string, string> = {
  case: 'bg-blue-100 text-blue-700',
  topic: 'bg-amber-100 text-amber-700',
  ponente: 'bg-emerald-100 text-emerald-700',
  statute: 'bg-purple-100 text-purple-700',
}

interface SearchBarProps {
  inputId?: string
  query: string
  onQueryChange: (q: string) => void
  onSubmit?: () => void
  suggestions: AutocompleteSuggestion[]
  onSuggestionSelect: (suggestion: AutocompleteSuggestion) => void
  onClear: () => void
  isSearching: boolean
  resultCount: number
  compact?: boolean
}

export default function SearchBar({
  inputId,
  query,
  onQueryChange,
  onSubmit,
  suggestions,
  onSuggestionSelect,
  onClear,
  isSearching,
  compact,
}: SearchBarProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (suggestions.length > 0 && query.length >= 2) {
      setShowDropdown(true)
      setActiveIndex(-1)
    } else {
      setShowDropdown(false)
    }
  }, [suggestions, query])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (showDropdown && activeIndex >= 0) {
        onSuggestionSelect(suggestions[activeIndex])
        setShowDropdown(false)
      } else {
        setShowDropdown(false)
        onSubmit?.()
      }
      return
    }
    if (!showDropdown) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <svg
          className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${compact ? 'left-3 w-3.5 h-3.5' : 'left-4 w-5 h-5'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          id={inputId}
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && query.length >= 2 && setShowDropdown(true)}
          placeholder={compact ? 'Search cases...' : 'Search cases, doctrines, statutes, justices...'}
          className={compact
            ? 'w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent'
            : 'w-full pl-12 pr-12 py-4 text-base rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent focus:bg-white/15 shadow-lg'
          }
        />

        <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 ${compact ? 'right-2.5' : 'right-4'}`}>
          {isSearching && (
            <div className={`border-2 border-amber-400 border-t-transparent rounded-full animate-spin ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
          )}
          {query && !isSearching && (
            <button onClick={onClear} className="text-slate-400 hover:text-slate-200 p-0.5 transition-colors">
              <svg className={compact ? 'w-3 h-3' : 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 top-full mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden ${compact ? '' : 'max-w-2xl'}`}
        >
          {suggestions.map((s, i) => (
            <button
              key={`${s.type}-${s.text}`}
              onClick={() => {
                onSuggestionSelect(s)
                setShowDropdown(false)
              }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors border-b border-slate-50 last:border-0 ${
                i === activeIndex ? 'bg-amber-50' : 'hover:bg-slate-50'
              }`}
            >
              <span className={`shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded ${TYPE_COLORS[s.type]}`}>
                {TYPE_LABELS[s.type]}
              </span>
              <span className="text-slate-700 truncate">{s.text}</span>
              {s.type === 'case' && (
                <svg className="w-3.5 h-3.5 text-slate-300 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
