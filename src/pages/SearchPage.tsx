import { useOutletContext } from 'react-router-dom'
import CaseCard from '../components/CaseCard'
import Sidebar from '../components/Sidebar'
import { useState, useMemo } from 'react'
import { getIndex, type CaseIndex } from '../utils/dataStore'

interface OutletContext {
  query: string
  results: CaseIndex[]
  isSearching: boolean
}

type SortKey = 'relevance' | 'date-desc' | 'date-asc' | 'title'

export default function SearchPage() {
  const { query, results, isSearching } = useOutletContext<OutletContext>()
  const [sort, setSort] = useState<SortKey>('relevance')

  const allCases = getIndex()
  const displayCases = query.trim() ? results : allCases

  const sortedCases = useMemo(() => {
    const cases = [...displayCases]
    switch (sort) {
      case 'date-desc':
        return cases.sort((a, b) => b.date.localeCompare(a.date))
      case 'date-asc':
        return cases.sort((a, b) => a.date.localeCompare(b.date))
      case 'title':
        return cases.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return cases // relevance = search engine order
    }
  }, [displayCases, sort])

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <Sidebar cases={allCases} />
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-500">
              {query.trim()
                ? isSearching
                  ? 'Searching...'
                  : `${sortedCases.length} result${sortedCases.length === 1 ? '' : 's'} for "${query}"`
                : `All ${sortedCases.length} cases`}
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="text-sm text-slate-600 bg-white border border-slate-200 rounded-md px-2 py-1"
            >
              {query.trim() && <option value="relevance">Relevance</option>}
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          {sortedCases.length === 0 && query.trim() ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg">No cases match your search</p>
              <p className="text-sm mt-1">Try different keywords, a G.R. number, or a legal topic</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedCases.map(c => (
                <CaseCard key={c.id} case_={c} query={query.trim() || undefined} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
