# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-05-05T02:39:59.558Z
> Files: 29 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `.gitignore` — Git ignore rules (~78 tok)
- `CLAUDE.md` — OpenWolf (~57 tok)
- `index.html` — LawPhilSearch — Philippine Legal Research Portal (~162 tok)
- `package.json` — Node.js package manifest (~260 tok)
- `vite.config.ts` (~63 tok)

## .claude/

- `settings.json` (~441 tok)

## .claude/rules/

- `openwolf.md` (~313 tok)

## .github/workflows/

- `deploy.yml` — CI: Deploy to GitHub Pages (~208 tok)

## C:/Users/miked/.claude/plans/

- `temporal-wibbling-nygaard.md` — Philippine Legal Research MVP (~736 tok)

## scripts/

- `build-db.mjs` — Build static database files from cases.json (~350 tok)
- `scrape-lawphil.mjs` — LawPhil Full-Text Scraper (~3375 tok)

## src/

- `App.tsx` — App (~396 tok)
- `index.css` — Styles: 1 rules (~7 tok)

## src/components/

- `CaseCard.tsx` — HighlightedText (~857 tok)
- `DecisionText.tsx` — DecisionText (~860 tok)
- `Layout.tsx` — Layout (~1779 tok)
- `SearchBar.tsx` — TYPE_LABELS (~1733 tok)
- `Sidebar.tsx` — Sidebar (~900 tok)

## src/data/

- `cases.json` — Declares suit (~67979 tok)

## src/hooks/

- `useSearch.ts` — Exports useSearch (~343 tok)

## src/pages/

- `CasePage.tsx` — CasePage (~4832 tok)
- `HomePage.tsx` — HomePage (~3579 tok)
- `SearchPage.tsx` — SearchPage (~835 tok)
- `TopicPage.tsx` — TopicPage (~844 tok)

## src/types/

- `case.ts` — Exports LegalCase, SearchResult, AutocompleteSuggestion (~162 tok)

## src/utils/

- `categories.ts` — Exports LawCategory, LAW_CATEGORIES, getCategoryForTopic, getCategoryColor (~1746 tok)
- `dataStore.ts` — Exports CaseIndex, loadIndex, loadCase, loadFullDecision, getIndex (~311 tok)
- `helpers.ts` — Exports formatDate, formatCitation, getTopicCounts, getCourtCounts + 2 more (~614 tok)
- `searchEngine.ts` — Exports initSearchEngine, search, getAutocompleteSuggestions (~1538 tok)
