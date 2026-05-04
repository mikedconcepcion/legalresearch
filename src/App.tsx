import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { initSearchEngine } from './utils/searchEngine'
import type { LegalCase } from './types/case'
import casesData from './data/cases.json'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import CasePage from './pages/CasePage'
import TopicPage from './pages/TopicPage'

const allCases = casesData as LegalCase[]

export default function App() {
  useEffect(() => {
    initSearchEngine(allCases)
  }, [])

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
