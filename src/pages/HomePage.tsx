import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { LegalCase, AutocompleteSuggestion } from '../types/case'
import { useSearch } from '../hooks/useSearch'
import SearchBar from '../components/SearchBar'
import { LAW_CATEGORIES } from '../utils/categories'
import casesData from '../data/cases.json'

const allCases = casesData as LegalCase[]

export default function HomePage() {
  const navigate = useNavigate()
  const { query, setQuery, suggestions, isSearching, clearSearch, results } = useSearch()

  const uniquePonentes = new Set(allCases.map(c => c.ponente)).size
  const uniqueStatutes = new Set(allCases.flatMap(c => c.citedStatutes)).size
  const [minYear, maxYear] = [
    Math.min(...allCases.map(c => new Date(c.date).getFullYear())),
    Math.max(...allCases.map(c => new Date(c.date).getFullYear())),
  ]

  // Count cases per category
  function countForCategory(topics: string[]): number {
    const topicSet = new Set(topics.map(t => t.toLowerCase()))
    return allCases.filter(c => c.topics.some(t => topicSet.has(t.toLowerCase()))).length
  }

  function handleQueryChange(q: string) {
    setQuery(q)
    // Don't navigate on every keystroke — wait for Enter or suggestion select
  }

  function handleSubmit() {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  function handleSuggestionSelect(s: AutocompleteSuggestion) {
    if (s.type === 'case' && s.caseId) {
      clearSearch()
      navigate(`/case/${s.caseId}`)
      return
    }
    if (s.type === 'topic') {
      clearSearch()
      navigate(`/topic/${encodeURIComponent(s.text)}`)
      return
    }
    handleQueryChange(s.text)
  }

  // Featured landmark cases
  const featuredIds = ['gr-l-45081-1936', 'gr-101083-1993', 'gr-208566-2013', 'gr-204819-2014']
  const featured = featuredIds.map(id => allCases.find(c => c.id === id)).filter(Boolean) as LegalCase[]

  return (
    <div>
      {/* Hero — Search First */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />

        <div className="relative px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Brand */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-6">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v11h14V7l-7-5zM8 12a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Philippine Legal Research Portal
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight leading-tight">
              Find the law.
              <br />
              <span className="text-amber-400">Understand the doctrine.</span>
            </h2>

            <p className="mt-4 text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              Search {allCases.length} Supreme Court landmark decisions spanning {maxYear - minYear} years
              of Philippine jurisprudence.
            </p>

            {/* Big Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar
                inputId="home-search"
                query={query}
                onQueryChange={handleQueryChange}
                onSubmit={handleSubmit}
                suggestions={suggestions}
                onSuggestionSelect={handleSuggestionSelect}
                onClear={() => { clearSearch(); navigate('/') }}
                isSearching={isSearching}
                resultCount={results.length}
              />
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
                <span className="text-slate-500">Try:</span>
                {['due process', 'police power', 'G.R. No.', 'Marcos', 'RA 6657'].map(term => (
                  <button
                    key={term}
                    onClick={() => { setQuery(term); navigate(`/search?q=${encodeURIComponent(term)}`) }}
                    className="text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Stats Bar */}
          <div className="max-w-2xl mx-auto mt-12 flex justify-center gap-8 md:gap-12 text-center">
            <div>
              <div className="text-xl font-bold text-white">{allCases.length}</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Cases</div>
            </div>
            <div className="w-px bg-slate-700" />
            <div>
              <div className="text-xl font-bold text-white">{uniquePonentes}</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Justices</div>
            </div>
            <div className="w-px bg-slate-700" />
            <div>
              <div className="text-xl font-bold text-white">{uniqueStatutes}</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Statutes</div>
            </div>
            <div className="w-px bg-slate-700" />
            <div>
              <div className="text-xl font-bold text-white">{minYear}&ndash;{maxYear}</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Law */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-900">Areas of Law</h3>
            <p className="text-sm text-slate-500 mt-0.5">Browse cases by legal discipline</p>
          </div>
          <Link to="/search" className="text-sm text-amber-700 hover:text-amber-800">
            View all cases &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {LAW_CATEGORIES.map(cat => {
            const count = countForCategory(cat.topics)
            return (
              <Link
                key={cat.id}
                to={`/topic/${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                    <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 group-hover:text-amber-800 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cat.description}</p>
                    <div className="text-[11px] text-slate-400 mt-1.5">{count} case{count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Landmark Cases */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">Landmark Decisions</h3>
          <p className="text-sm text-slate-500 mb-6">Foundational cases in Philippine jurisprudence</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map(c => (
              <Link
                key={c.id}
                to={`/case/${c.id}`}
                className="group p-5 rounded-lg border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 font-serif font-bold text-lg">
                    {new Date(c.date).getFullYear().toString().slice(2)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-semibold text-slate-900 group-hover:text-amber-800 transition-colors">
                      {c.title}
                    </h4>
                    <div className="text-xs text-slate-500 mt-0.5">{c.grNumber} &middot; {c.ponente}</div>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2 italic">
                      &ldquo;{c.doctrine.slice(0, 150)}{c.doctrine.length > 150 ? '...' : ''}&rdquo;
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-900 text-sm">Intelligent Search</h4>
            <p className="text-xs text-slate-500 mt-1">
              Full-text search with auto-complete across case titles, doctrines, statutes, and justices
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.556a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.343 8.53" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-900 text-sm">Cross-Referenced</h4>
            <p className="text-xs text-slate-500 mt-1">
              Cases linked by related decisions, cited statutes, and shared legal topics
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-900 text-sm">Doctrine Summaries</h4>
            <p className="text-xs text-slate-500 mt-1">
              Each case includes the key doctrine, summary, and full decision text
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
