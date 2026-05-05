import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { initSearchEngine } from './utils/searchEngine'
import { loadIndex, type CaseIndex } from './utils/dataStore'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import CasePage from './pages/CasePage'
import TopicPage from './pages/TopicPage'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadIndex().then(cases => {
      initSearchEngine(cases)
      setReady(true)
    })
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 mt-3">Loading database...</p>
        </div>
      </div>
    )
  }

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/case/:id" element={<CasePage />} />
          <Route path="/topic/:topic" element={<TopicPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
