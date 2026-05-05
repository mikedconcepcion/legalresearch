import { useParams, Link } from 'react-router-dom'
import CaseCard from '../components/CaseCard'
import Sidebar from '../components/Sidebar'
import { useState, useMemo } from 'react'
import { getIndex } from '../utils/dataStore'

type SortKey = 'date-desc' | 'date-asc' | 'title'

export default function TopicPage() {
  const allCases = getIndex()
  const { topic } = useParams<{ topic: string }>()
  const decodedTopic = topic ? decodeURIComponent(topic) : ''
  const [sort, setSort] = useState<SortKey>('date-desc')

  const filteredCases = allCases.filter(c =>
    c.topics.some(t => t.toLowerCase() === decodedTopic.toLowerCase())
  )

  const sortedCases = useMemo(() => {
    const cases = [...filteredCases]
    switch (sort) {
      case 'date-asc':
        return cases.sort((a, b) => a.date.localeCompare(b.date))
      case 'title':
        return cases.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return cases.sort((a, b) => b.date.localeCompare(a.date))
    }
  }, [filteredCases, sort])

  if (!decodedTopic) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-lg text-slate-500">Topic not found</p>
        <Link to="/" className="text-amber-700 text-sm mt-2 inline-block">&larr; Back to home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <Sidebar cases={allCases} activeTopic={decodedTopic} />
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <Link to="/" className="text-xs text-amber-700 hover:text-amber-800">&larr; Home</Link>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">{decodedTopic}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {sortedCases.length} case{sortedCases.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="flex justify-end mb-4">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="text-sm text-slate-600 bg-white border border-slate-200 rounded-md px-2 py-1"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          {sortedCases.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p>No cases found for this topic</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedCases.map(c => (
                <CaseCard key={c.id} case_={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
