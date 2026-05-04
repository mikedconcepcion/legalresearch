import { Outlet, useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import type { AutocompleteSuggestion } from '../types/case'
import { useSearch } from '../hooks/useSearch'
import SearchBar from './SearchBar'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { query, setQuery, results, suggestions, isSearching, clearSearch } = useSearch()
  const isHome = location.pathname === '/'

  // Sync URL query param to search state
  const urlQuery = searchParams.get('q') || ''
  useEffect(() => {
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery)
    } else if (!urlQuery && query && location.pathname === '/search') {
      // Cleared search
      clearSearch()
    }
  }, [urlQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        const el = document.getElementById('global-search') || document.getElementById('home-search')
        el?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  function handleQueryChange(q: string) {
    setQuery(q)
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q)}`, { replace: true })
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

  function handleClear() {
    clearSearch()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation bar */}
      <header className={`sticky top-0 z-40 transition-all ${
        isHome
          ? 'bg-slate-900/95 backdrop-blur-sm border-b border-slate-800'
          : 'bg-slate-900 shadow-lg'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4 h-14">
            {/* Logo */}
            <Link to="/" onClick={handleClear} className="shrink-0 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V15" />
                </svg>
              </div>
              <div>
                <span className="text-white font-serif font-bold text-sm tracking-tight">
                  LawPhil<span className="text-amber-400">Search</span>
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs">
              <Link to="/" className="px-3 py-1.5 text-slate-400 hover:text-white rounded-md transition-colors">Home</Link>
              <Link to="/search" className="px-3 py-1.5 text-slate-400 hover:text-white rounded-md transition-colors">Cases</Link>
              <Link to="/topic/Constitutional%20Law" className="px-3 py-1.5 text-slate-400 hover:text-white rounded-md transition-colors">Constitutional</Link>
              <Link to="/topic/Criminal%20Law" className="px-3 py-1.5 text-slate-400 hover:text-white rounded-md transition-colors">Criminal</Link>
              <Link to="/topic/Civil%20Law" className="px-3 py-1.5 text-slate-400 hover:text-white rounded-md transition-colors">Civil</Link>
            </nav>

            {/* Search — hidden on home page since hero has its own */}
            {!isHome && (
              <div className="flex-1 max-w-md">
                <SearchBar
                  inputId="global-search"
                  query={query}
                  onQueryChange={handleQueryChange}
                  suggestions={suggestions}
                  onSuggestionSelect={handleSuggestionSelect}
                  onClear={handleClear}
                  isSearching={isSearching}
                  resultCount={results.length}
                  compact
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet context={{ query, results, isSearching }} />
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V15" />
                </svg>
              </div>
              <span className="text-slate-400 text-sm font-serif">LawPhil<span className="text-amber-400">Search</span></span>
            </div>
            <div className="text-xs text-slate-500 text-center">
              For educational and research purposes only &middot; Not legal advice
              <span className="hidden sm:inline"> &middot; Press <kbd className="px-1 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 border border-slate-700">/</kbd> to search</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
