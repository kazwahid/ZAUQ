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

* **What problem does it solve?** Traditional fashion e-commerce forces users through tedious 30-checkbox filter trees or brittle keyword searches that fail on descriptive moods (*"moody old money linen for a coastal Italian dinner"*). Meanwhile, engagement-optimized social feeds (TikTok/Instagram) are engineered for endless doom-scrolling rather than resolving a time-boxed outfit need.
* **Who is it for?** People looking for occasion-specific outfits who want high-conviction curated discovery without account walls, tracking cookies, or filter fatigue.
* **The Solution:** Zauq replaces checkbox filtering with **Natural Language Intent $\rightarrow$ Structured Taxonomy Translation $\rightarrow$ Deterministic Instant Ranking**, wrapped in a 1-product-at-a-time reels snap-scroll feed.

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

Instead of building a conversational chatbot that hallucinates product inventory, Zauq uses an LLM as a **Semantic Intent Translator**:

### System Prompt Design:
1. **Grounding in Fixed Taxonomy:** The model receives our exact multi-dimensional fashion ontology (`ALLOWED_TAXONOMY`) covering occasions, silhouettes, palettes, patterns, seasons, and categories.
2. **Deterministic Output Contract:** Enforces strict `application/json` formatting validated through Zod.
3. **Editorial Title Generation:** Condenses user intent into a clean 2–3 word breadcrumb chip (e.g., *"Quiet Luxury Linen"*, *"Black Tie Silk"*).

### Resilience & Fail-Safe Strategy (FE-07):
* **Offline Fallback Engine:** If the LLM times out, hits rate limits, or is offline, `/api/interpret` executes a comprehensive 150+ synonym heuristic dictionary that extracts exact taxonomy tokens deterministically.
* **Empty State Recovery:** If filters are too restrictive, `EmptyState.tsx` offers one-click undo and smart relaxation suggestions.

---

## 4. Testing & Verification

Zauq features a comprehensive Vitest test suite covering core client scoring, breadcrumb manipulations, interactive card gestures, and the search dock.

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

## 5. Accessibility & Performance (WCAG 2.1 AA)

* **Semantic HTML & Landmarks:** Proper `<article>`, `<section>`, `<nav>`, and heading hierarchies throughout.
* **Screen Reader & ARIA:** Explicit `aria-label` attributes on all interactive controls (Like, Save, Share, Close, Refine).
* **Keyboard Navigation:** Full keyboard navigation support (`ArrowDown` / `ArrowUp` / `J` / `K` for reels navigation, `Tab` focus rings, and `Esc` modal dismissals).
* **High-Contrast Text:** Minimum 4.5:1 contrast ratios on all metadata and tags.
* **Performance:** Image dimensions reserved, lazy loading, and CSS overscroll containment (`overscroll-behavior-y: contain`).

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

## 7. Deployment & Rollback Strategy

* **Hosting:** Deployed on **Vercel** with automatic continuous deployment on `main` branch pushes.
* **Production Build:** Passes `npm run build` with zero TypeScript or ESLint warnings.
* **Rollback Plan:** In the event of an incident, instant rollback is executed via Vercel Dashboard $\rightarrow$ Deployments $\rightarrow$ *Instant Rollback to Previous Deployment*.
