import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import type { LegalCase } from '../types/case'
import { formatDate, formatCitation } from '../utils/helpers'
import DecisionText from '../components/DecisionText'
import { loadCase, loadFullDecision as fetchFullDecision, getIndex } from '../utils/dataStore'

type FullTextState = { status: 'idle' } | { status: 'loading' } | { status: 'loaded'; text: string } | { status: 'error' }

export default function CasePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [c, setCase] = useState<LegalCase | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showFullText, setShowFullText] = useState(false)
  const [fullDecision, setFullDecision] = useState<FullTextState>({ status: 'idle' })

  // Load case data
  useEffect(() => {
    if (!id) return
    setLoading(true)
    setFullDecision({ status: 'idle' })
    setShowFullText(false)
    loadCase(id).then(data => {
      setCase(data)
      setLoading(false)
    })
  }, [id])

  const loadFullText = useCallback(async () => {
    if (!id || fullDecision.status === 'loading' || fullDecision.status === 'loaded') return
    setFullDecision({ status: 'loading' })
    const text = await fetchFullDecision(id)
    if (text) {
      setFullDecision({ status: 'loaded', text })
    } else {
      setFullDecision({ status: 'error' })
    }
  }, [id, fullDecision.status])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 flex justify-center">
        <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!c) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-lg text-slate-500">Case not found</p>
        <Link to="/" className="text-amber-700 hover:text-amber-800 text-sm mt-2 inline-block">
          &larr; Back to home
        </Link>
      </div>
    )
  }

  const indexMap = new Map(getIndex().map(x => [x.id, x]))
  const relatedCases = c.relatedCases
    .map(rid => indexMap.get(rid))
    .filter(Boolean)

  const year = new Date(c.date).getFullYear()

  async function copyCitation() {
    const text = formatCitation(c!)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <article className="flex-1 min-w-0">
          {/* Case Header */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Top bar with year */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-amber-400 font-serif font-bold text-xl">{year}</span>
                <span className="text-slate-500 text-xs">{c.court}</span>
              </div>
              <button
                onClick={copyCitation}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-700 rounded-md text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Citation
                  </>
                )}
              </button>
            </div>

            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">
                {c.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="font-medium text-slate-600">{c.grNumber}</span>
                <span className="text-slate-300">|</span>
                <span>{formatDate(c.date)}</span>
                <span className="text-slate-300">|</span>
                <span className="italic">{c.ponente}</span>
              </div>

              {/* Parties */}
              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-20">Petitioner</span>
                  <span className="font-medium text-slate-700">{c.petitioner}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-20">Respondent</span>
                  <span className="font-medium text-slate-700">{c.respondent}</span>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {c.topics.map(t => (
                  <Link
                    key={t}
                    to={`/topic/${encodeURIComponent(t)}`}
                    className="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs rounded-md border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mt-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Summary
            </h2>
            <p className="text-slate-700 leading-relaxed">{c.summary}</p>
          </div>

          {/* Doctrine */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mt-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Doctrine Established
            </h2>
            <blockquote className="text-slate-700 leading-relaxed italic border-l-3 border-amber-400 pl-4 py-1">
              {c.doctrine}
            </blockquote>
          </div>

          {/* Decision Text */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                {showFullText && fullDecision.status === 'loaded' ? 'Full Decision Text' : 'Decision Excerpt'}
              </h2>
              {showFullText && (
                <button
                  onClick={() => setShowFullText(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Show excerpt only
                </button>
              )}
            </div>

            {/* Excerpt view (default) */}
            {!showFullText && (
              <>
                <div className="max-h-48 overflow-hidden relative">
                  <DecisionText text={c.fullText} />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                </div>
                <button
                  onClick={() => { setShowFullText(true); loadFullText() }}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Read Full Decision
                </button>
              </>
            )}

            {/* Full text view */}
            {showFullText && (
              <>
                {fullDecision.status === 'loading' && (
                  <div className="flex items-center gap-3 py-8 justify-center text-slate-400">
                    <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Loading full decision text...</span>
                  </div>
                )}

                {fullDecision.status === 'loaded' && (
                  <div className="max-h-[80vh] overflow-y-auto pr-2">
                    <DecisionText text={fullDecision.text} />
                  </div>
                )}

                {fullDecision.status === 'error' && (
                  <div className="py-6">
                    <div className="mb-4">
                      <DecisionText text={c.fullText} />
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      <span>
                        Full decision text not yet available for this case.
                        {c.sourceUrl && (
                          <> Read it on <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-amber-900">LawPhil.net</a></>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {fullDecision.status === 'idle' && (
                  <DecisionText text={c.fullText} />
                )}
              </>
            )}
          </div>

          {/* Source link */}
          {c.sourceUrl && (
            <div className="mt-2 text-right">
              <a
                href={c.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-amber-700 transition-colors inline-flex items-center gap-1"
              >
                Source: LawPhil.net
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          )}

          {/* Citation */}
          <div className="mt-4 p-4 bg-slate-100 rounded-lg text-xs text-slate-500 font-mono">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Cite as</span>
            {formatCitation(c)}
          </div>
        </article>

        {/* Right Sidebar */}
        <aside className="lg:w-72 shrink-0 space-y-4">
          {/* Cited Statutes */}
          {c.citedStatutes.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Cited Statutes
              </h3>
              <div className="space-y-1.5">
                {c.citedStatutes.map(s => (
                  <div key={s} className="px-3 py-2 bg-purple-50 text-purple-800 text-xs rounded-md border border-purple-100">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Cases */}
          {relatedCases.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Related Cases
              </h3>
              <div className="space-y-2">
                {relatedCases.map(rc => (
                  <Link
                    key={rc.id}
                    to={`/case/${rc.id}`}
                    className="block p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-amber-300 hover:bg-amber-50/30 transition-colors"
                  >
                    <div className="font-serif font-medium text-xs text-slate-800">{rc.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {rc.grNumber} &middot; {formatDate(rc.date)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Case Metadata */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Case Details
            </h3>
            <dl className="space-y-2.5 text-xs">
              <div>
                <dt className="text-slate-400">G.R. Number</dt>
                <dd className="text-slate-700 font-medium">{c.grNumber}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Date</dt>
                <dd className="text-slate-700 font-medium">{formatDate(c.date)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Court</dt>
                <dd className="text-slate-700 font-medium">{c.court}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Ponente</dt>
                <dd className="text-slate-700 font-medium">{c.ponente}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Petitioner</dt>
                <dd className="text-slate-700 font-medium">{c.petitioner}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Respondent</dt>
                <dd className="text-slate-700 font-medium">{c.respondent}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}
