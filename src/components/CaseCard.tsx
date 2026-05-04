import { Link } from 'react-router-dom'
import type { LegalCase } from '../types/case'
import { formatDate, highlightText } from '../utils/helpers'

interface CaseCardProps {
  case_: LegalCase
  query?: string
  compact?: boolean
}

function HighlightedText({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>
  const { parts } = highlightText(text, query)
  return (
    <>
      {parts.map((p, i) =>
        p.highlight ? (
          <mark key={i} className="bg-amber-200/70 text-amber-900 rounded-sm px-0.5">{p.text}</mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  )
}

export default function CaseCard({ case_: c, query, compact }: CaseCardProps) {
  const year = new Date(c.date).getFullYear()

  return (
    <Link
      to={`/case/${c.id}`}
      className="group block bg-white rounded-lg border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all overflow-hidden"
    >
      <div className="flex">
        {/* Year accent strip */}
        <div className="hidden sm:flex shrink-0 w-16 bg-slate-50 border-r border-slate-100 flex-col items-center justify-center text-center group-hover:bg-amber-50 transition-colors">
          <span className="text-lg font-bold text-slate-400 group-hover:text-amber-700 transition-colors font-serif">{year}</span>
        </div>

        <div className={`flex-1 min-w-0 ${compact ? 'p-3' : 'p-4 md:p-5'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className={`font-serif font-semibold text-slate-900 group-hover:text-amber-800 transition-colors ${compact ? 'text-sm' : 'text-base md:text-lg'}`}>
                <HighlightedText text={c.title} query={query} />
              </h3>
              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-2">
                <span className="font-medium text-slate-500">{c.grNumber}</span>
                <span>&middot;</span>
                <span>{formatDate(c.date)}</span>
                <span>&middot;</span>
                <span>{c.ponente}</span>
              </div>
            </div>
          </div>

          {!compact && (
            <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              <HighlightedText text={c.summary} query={query} />
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {c.topics.slice(0, compact ? 3 : 5).map(t => (
              <span key={t} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[11px] rounded-md border border-slate-100">
                {t}
              </span>
            ))}
            {c.topics.length > (compact ? 3 : 5) && (
              <span className="px-2 py-0.5 text-slate-400 text-[11px]">
                +{c.topics.length - (compact ? 3 : 5)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
