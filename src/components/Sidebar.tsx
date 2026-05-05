import { Link, useLocation } from 'react-router-dom'
import { getTopicCounts, getCourtCounts, getYearRange } from '../utils/helpers'
import type { CaseIndex } from '../utils/dataStore'

interface SidebarProps {
  cases: CaseIndex[]
  activeTopic?: string
}

export default function Sidebar({ cases, activeTopic }: SidebarProps) {
  const location = useLocation()
  const topicCounts = getTopicCounts(cases)
  const courtCounts = getCourtCounts(cases)
  const [minYear, maxYear] = getYearRange(cases)

  // Group topics by count tiers for cleaner display
  const topTopics = [...topicCounts.entries()].slice(0, 15)

  return (
    <aside className="space-y-6">
      {/* Topics */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Browse by Topic
        </h3>
        <div className="space-y-0.5">
          {topTopics.map(([topic, count]) => {
            const isActive = activeTopic === topic
            return (
              <Link
                key={topic}
                to={`/topic/${encodeURIComponent(topic)}`}
                className={`flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-amber-100 text-amber-900 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="truncate">{topic}</span>
                <span className={`text-xs ${isActive ? 'text-amber-700' : 'text-slate-400'}`}>
                  {count}
                </span>
              </Link>
            )
          })}
          {topicCounts.size > 15 && (
            <p className="text-xs text-slate-400 px-3 pt-1">
              +{topicCounts.size - 15} more topics
            </p>
          )}
        </div>
      </div>

      {/* Courts */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          By Court
        </h3>
        <div className="space-y-0.5">
          {[...courtCounts.entries()].map(([court, count]) => (
            <div
              key={court}
              className="flex items-center justify-between px-3 py-1.5 text-sm text-slate-600"
            >
              <span className="truncate">{court}</span>
              <span className="text-xs text-slate-400">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Year Range */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Timeline
        </h3>
        <p className="text-sm text-slate-600 px-3">
          {minYear} &mdash; {maxYear}
        </p>
        <p className="text-xs text-slate-400 px-3 mt-1">
          {cases.length} decisions spanning {maxYear - minYear} years
        </p>
      </div>

      {/* All Topics Link */}
      {location.pathname !== '/' && (
        <Link
          to="/"
          className="block text-sm text-amber-700 hover:text-amber-800 px-3"
        >
          &larr; Back to home
        </Link>
      )}
    </aside>
  )
}
