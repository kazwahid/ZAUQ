# Zauq (ذوق) — AI-Guided Occasion Fashion Discovery Engine

> **Etymology:** *Zauq* (ذوق) is the Urdu word for cultivated aesthetic taste, discernment, and personal style.

[![Live Deployment](https://img.shields.io/badge/Live_Demo-Vercel-black?logo=vercel)](https://zauq-kazwahids-projects.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-kazwahid%2FZAUQ-181717?logo=github)](https://github.com/kazwahid/ZAUQ)
[![Tests Passing](https://img.shields.io/badge/Tests-16%20Passed-success?logo=vitest)](https://vitest.dev)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org)

> **One-Line Proposition:** *Zauq turns what you have in mind into what’s worth looking at.*

---

## 1. Project Brief & Value Proposition

**Project Brief:** Traditional fashion e-commerce forces users through tedious 30-checkbox filter trees or brittle keyword searches that fail on descriptive moods (*"moody old money linen for a coastal Italian dinner"*), while engagement-optimized social video feeds encourage infinite doom-scrolling rather than resolving a time-boxed outfit need. **Zauq** is built for discerning individuals looking for occasion-specific attire who want high-conviction, curated discovery without account walls, tracking cookies, or filter fatigue. By replacing traditional filtering with **Natural Language Intent $\rightarrow$ Structured Taxonomy Translation $\rightarrow$ Deterministic Instant Ranking**, Zauq delivers a 1-product-at-a-time reels snap-scroll feed that explains *why* each piece fits your exact brief.

> **Transparency Notice (Synthetic Demo Catalog):** Product names, brands (*Atelier Nöir*, *Studio L'Ombre*, *Sartoria Vane*), prices, and editorial descriptions are synthetic data curated for demonstration and discovery architecture modeling.

---

## 2. System Architecture

```
                                  [ User Input ]
                   "I need something quiet luxury in linen for dinner"
                                         │
                                         ▼
                        ┌─────────────────────────────────┐
                        │    Edge Route: /api/interpret   │
                        │  • Rate Limiting (45 req/min)   │
                        │  • Google Gemini 1.5 Flash      │
                        │  • Strict JSON Schema & Zod     │
                        │  • 5.5s Timeout + Safe Fallback │
                        └────────────────┬────────────────┘
                                         │
                                         ▼
                             [ Structured Intent JSON ]
                        {
                          "label": "Quiet Luxury Linen",
                          "tags": {
                            "occasion": ["dinner", "cocktail"],
                            "pattern": ["linen-texture"],
                            "palette": ["neutral", "earthy"],
                            "silhouette": ["tailored", "minimalist"]
                          }
                        }
                                         │
                                         ▼
                        ┌─────────────────────────────────┐
                        │   Deterministic Client Scorer   │
                        │          (scoring.ts)           │
                        │  • Tag Intersection Weighting   │
                        │  • Specificity Cascade (20-100%)│
                        │  • sub-5ms Execution Latency    │
                        └────────────────┬────────────────┘
                                         │
                                         ▼
                        ┌─────────────────────────────────┐
                        │     Interactive Visual Feed     │
                        │  • 1-Look Snap-Scroll Reels     │
                        │  • "Why Zauq Picked This" Trace │
                        │  • Single-Screen Detail Modal   │
                        └─────────────────────────────────┘
```

---

## 3. Meaningful AI & Prompt Engineering Strategy

Instead of building an open-ended conversational chatbot that hallucinates product inventory, Zauq leverages an LLM as a **Semantic Intent Translator**:

### System Prompt Design:
1. **Grounding in Fixed Taxonomy:** The model receives our exact multi-dimensional fashion ontology (`ALLOWED_TAXONOMY`) covering occasions, silhouettes, palettes, patterns, seasons, and categories.
2. **Deterministic Output Contract:** Enforces strict `application/json` formatting validated through Zod schema parsing.
3. **Editorial Title Generation:** Condenses user intent into a clean 2–3 word breadcrumb chip (e.g., *"Quiet Luxury Linen"*, *"Black Tie Silk"*).

### Resilience & Fail-Safe Strategy (FE-07):
* **Offline / Quota Fallback Engine:** If the LLM times out ($>5.5\text{s}$), hits rate limits (429), or is offline, `/api/interpret` executes a comprehensive 150+ synonym heuristic dictionary that extracts exact taxonomy tokens deterministically with zero user-facing crash.
* **Empty State Recovery:** If active filters produce 0 matching looks, `EmptyState.tsx` offers one-click undo and smart relaxation suggestions.

---

## 4. Testing Evidence & Verification

Zauq features a Vitest test suite covering core client scoring, breadcrumb manipulations, interactive card gestures, and the search dock.

```bash
npm test
```

### Test Coverage Results (16 Tests Passing):
```
 ✓ src/lib/scoring.test.ts (6 tests)
 ✓ src/components/BreadcrumbChips.test.tsx (4 tests)
 ✓ src/components/Card.test.tsx (3 tests)
 ✓ src/components/BottomDock.test.tsx (3 tests)

 Test Files  4 passed (4)
      Tests  16 passed (16)
```

---

## 5. Performance & Accessibility Audit (WCAG 2.1 AA)

* **Semantic HTML & Landmarks:** Proper `<article>`, `<section>`, `<nav>`, and heading hierarchies (`<h1>` &rarr; `<h2>`) throughout.
* **Screen Reader & ARIA:** Explicit `aria-label` attributes on all interactive controls (Like, Save, Share, Close, Refine), plus `aria-live="polite"` regions announcing feed curation counts.
* **Keyboard Navigation:** Full keyboard navigation support (`ArrowDown` / `ArrowUp` / `J` / `K` for reels navigation, `Tab` focus rings, and `Esc` modal dismissals).
* **High-Contrast Text:** Minimum 4.5:1 contrast ratios on all metadata and tags.
* **Audit-Driven Improvement:** Based on axe DevTools findings, removed nested button elements inside the card surface, added accessible live-region announcements for taste filtering, and added visible focus rings for keyboard-only navigation.
* **Lighthouse Scores:** Performance: 95+ | Accessibility: 98+ | Best Practices: 100 | SEO: 100.

---

## 6. Setup & Local Development

```bash
# 1. Clone the repository
git clone https://github.com/kazwahid/ZAUQ.git
cd zauq

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Add your GEMINI_API_KEY (from https://aistudio.google.com)

# 4. Start local development server
npm run dev

# 5. Run test suite
npm test

# 6. Production build verification
npm run build
```

---

## 7. Deployment & Operational Readiness (FE-11)

### Deployment Checklist:
- [x] **Production Build Verification:** `npm run build` completes with 0 errors and all static routes compiled.
- [x] **Automated Tests:** 16/16 Vitest unit tests passing in CI/CD pipeline.
- [x] **Environment Variables:** `GEMINI_API_KEY` configured securely on Vercel production environment.
- [x] **Graceful Error Handling:** Rate limits, timeouts, and network interruptions caught with fallback heuristic extraction.
- [x] **Security Headers & Sanitization:** Input sanitization via Zod schema parsing and Edge runtime rate limiting.
- [x] **Rollback Plan:** Instant rollback enabled via Vercel Dashboard &rarr; *Instant Rollback to Previous Deployment*.

---

## 8. Known Limitations & Future Improvements

1. **Synthetic Catalog Scaling:** Current catalog contains 40 curated demonstration pieces. Future iterations can integrate a real-time headless Shopify or Medusa catalog API.
2. **Vector Similarity Embeddings:** Integrating vector search (Pinecone / pgvector) alongside deterministic taxonomy tagging for multi-modal visual embeddings.
3. **Personalized Taste History:** Allowing local storage profile weights to dynamically influence future rankings over multiple sessions.

---

## 9. Capstone Reflection

* **What was hardest? Why?**
  Balancing an Instagram-style fluid 1-look-at-a-time snap-scroll reel with clean, non-intrusive AI refinement. Designing an interface that feels quiet, cinematic, and luxury while maintaining strict WCAG AA accessibility, zero scrollbar pollution, and responsive viewport sizing across mobile and laptop screens was a demanding exercise in layout engineering.
* **What would you do differently next time?**
  Design the deterministic fallback engine *before* writing the LLM prompt. Establishing the structured taxonomy and heuristic parser first made the AI prompt simpler and eliminated prompt hallucinations.
* **One thing learned that surprised me:**
  Users do not want an AI conversational chatbot to shop for clothes—they want a fast, opinionated, structured curation engine that transparently explains *why* each piece fits their aesthetic brief.
