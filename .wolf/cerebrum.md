# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-05-05

## User Preferences

- User wants **presentational quality** — not just functional. "Philippine Jurisprudence" alone isn't enough; the app should look and feel like a proper legal research portal.
- Prefers **search-first design** — the hero should center on search, not stats/marketing.
- Wants **structured legal categories** (Areas of Law) not just flat topic tags.
- MVP mindset — build it, ship it, iterate. But the MVP should still look polished.
- Brand: settled on **LawPhilSearch** as the app name.
- Framework: React + Vite + TypeScript + Tailwind (client-side only, GitHub Pages deploy).
- Client-side search only (FlexSearch), no API keys.

## Key Learnings

- **Project:** Legal_Research — Philippine legal research webapp (LawPhilSearch)
- **FlexSearch 0.8** API: uses `Document` class, `docIndex.search()` returns array of `{ field, result: id[] }` per indexed field. Must iterate all field results to collect unique IDs.
- **HashRouter** required for GitHub Pages (no server-side routing). Vite base must match repo name `/Legal_Research/`.
- Cases organized into 10 law categories defined in `src/utils/categories.ts`.
- 51 landmark cases from 1909-2018 across constitutional, civil, criminal, labor, tax, family, admin, international, and special laws.

## Do-Not-Repeat

- [2026-05-05] Don't present a legal research portal with generic/tech-demo styling. The presentation must match the domain — authoritative, structured by areas of law, search-first.
- [2026-05-04] Vite `create` fails on non-empty directories. Use temp scaffold + copy approach.

## Decision Log

- [2026-05-04] React + Vite over Astro/Next: the app is 70%+ interactive (search, filters, detail views). Astro would be overkill for a blog-style site; this needs SPA behavior.
- [2026-05-04] FlexSearch over Lunr: better performance, supports Document-level multi-field indexing out of the box.
- [2026-05-05] HashRouter over BrowserRouter: GitHub Pages serves only index.html, so hash routing avoids 404s on direct URL access.
- [2026-05-05] Rebranded from "Philippine Legal Research" to "LawPhilSearch" for stronger identity.
- [2026-05-05] 10 law categories (Constitutional, Civil Liberties, Criminal, Civil, Family, Labor, Admin, Taxation, International, Special Laws) — mapped from 125 individual topics.
