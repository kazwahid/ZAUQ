# Zauq (ذوق) — AI-Driven Occasion Fashion Discovery Feed

> **Etymology:** *Zauq* (ذوق) is the Urdu word for taste — the specific, cultivated sense of aesthetic discernment and what suits you. It is a literal description of what the product sharpens over the course of a discovery session.

[![Vercel Deployment](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-yellow?logo=vitest)](https://vitest.dev)

---

## 0. Project Brief

**Zauq** is a login-free, single-session AI fashion discovery feed for anyone who needs an outfit for a specific occasion fast and doesn't want to hunt across a dozen retailer tabs to find it. It solves shopping decision-fatigue by letting the user narrow a generic feed in real time through short free-text refinements ("beach vacation," then "floral linen") and simple like/skip/save actions, with every refinement shown as a removable breadcrumb chip so the narrowing stays visible and undoable rather than hidden inside a black-box algorithm. The idea was chosen because the underlying problem — and even the individual mechanics (AI-driven conversational narrowing, swipe-based fashion discovery) — are independently well-validated by existing products, which made it a good candidate for demonstrating applied product thinking, disciplined AI integration, and frontend craft on a zero-budget, short build window, rather than a bet on an unproven idea.

---

## 1. Honest Positioning

> **Core Philosophy:** Zauq demonstrates the core mechanics behind category-defining products (*The Yes*, *Glance AI*'s conversational narrowing, *Mallzee/Stylect*'s swipe interaction) — recombined and executed solo on a zero-cost stack. The goal isn't an unproven novelty; it's proof of rigorous product thinking, disciplined AI architecture, and mobile-first frontend craft.

### Why not just use Instagram or TikTok?
Zauq isn't trying to out-inspire Instagram or TikTok — their algorithms are genuinely excellent at serendipitous, impulse-driven discovery backed by a decade of engagement data. 

Zauq solves a fundamentally different job: **resolving a specific, time-boxed need** (*"I need an outfit for a rooftop dinner in two hours"*) fast, with **visible, user-editable state**. Engagement-optimized feeds are structurally not built to do this, because their business model rewards keeping you scrolling indefinitely rather than resolving your need and letting you leave satisfied.

---

## 2. Core Architecture

```
[Client: React State + localStorage]
        │
        ├── User types natural language: "beach vacation" / "linen quiet luxury"
        ▼
[Next.js Serverless API Route: /api/interpret]
        │  • Server-side API key protection (GEMINI_API_KEY)
        │  • In-memory rate limiting & input caps (max 120 chars)
        │  • 6-second timeout with AbortController
        │  • Calls Google Gemini with strict JSON schema
        │  • Validates output against Zod schema & fixed taxonomy
        ▼
[Client: Merges structured tags into active breadcrumb chips]
        │
        ▼
[Client Deterministic Scorer: rankCatalog()]
        │  • Weighted tag intersection (occasion: 3.2, setting: 2.8, pattern: 1.8, ...)
        │  • 100% deterministic & reversible (removing a chip restores previous score)
        │  • Stable secondary tie-breaker (item ID)
        ▼
[Feed Re-renders with Framer Motion transitions]
```

---

## 3. Key Features

1. **Gate-Free Discovery:** Instant catalog feed on initial load with zero logins, onboarding walls, or tracking cookies.
2. **Natural Language Refinement:** Translates fuzzy human descriptions (*"cozy fall oversized knit"*, *"rooftop cocktail dressy"*) into structured taxonomy filters.
3. **Visible & Reversible State (Anti-Blackbox):** Every refinement appears as a removable breadcrumb chip. Removing any chip instantly recalculates scores deterministically.
4. **Accessible Action Baseline + Touch Swipe:** High-contrast buttons for **Like (❤️)**, **Skip (✕)**, and **Save (🔖)** with touch drag gestures layered on top.
5. **Saved Outfits Collection Drawer:** Slide-over modal with a one-tap *"Find this for real"* outbound Google Shopping search link (`google.com/search?tbm=shop&q=...`) and shareable wishlist copying.
6. **Resilient AI Fallback:** 6-second timeout and schema validator. If the AI model times out or hits rate limits, the app seamlessly falls back to smart deterministic keyword heuristics without ever crashing or breaking the feed.

---

## 4. Setup & Running Locally

### Quick Start (Under 3 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/zauq.git
cd zauq

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Add your free Gemini API key to .env.local (from https://aistudio.google.com)

# 4. Start the development server
npm run dev

# 5. Open http://localhost:3000 in your browser
```

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | Recommended | None | Google Gemini API key. If omitted, uses smart offline heuristic fallback. |
| `GEMINI_MODEL` | Optional | `gemini-1.5-flash` | Gemini model endpoint (supports `gemini-1.5-flash`, `gemini-2.0-flash`, etc.). |

---

## 5. Testing & Quality Assurance

Tests are powered by **Vitest** and **React Testing Library**:

```bash
# Run unit & component test suite
npm test

# Run tests with coverage summary
npm run test:coverage
```

### Coverage Scope:
- **Scoring Engine (`src/lib/scoring.test.ts`)**: Tests baseline ranking, single filter boost, compound multi-tag stacking, filter removal reversibility, and stable tie-breaking.
- **Components (`src/components/BreadcrumbChips.test.tsx`)**: Tests chip rendering, removal callbacks, and empty state handling.

---

## 6. Accessibility & Performance (WCAG 2.1 AA)

- **Keyboard Navigation:** Full keyboard operability (`← Skip`, `→ Like`, `S Save`, `Esc` to close modals, `Tab` order).
- **Accessible Contrast:** Verified text contrast ratios ≥ 4.5:1 on all editorial surfaces.
- **Screen Reader Support:** Accessible `aria-label` attributes on all card actions and `aria-live="polite"` on toast announcements.
- **Zero Third-Party Image Latency:** Catalog images use optimized CDN links with responsive layouts.

---

## 7. Known Limitations

- **Statically Curated Catalog:** Built with 52 hand-curated, multi-tagged editorial fashion items. A live retail inventory API (e.g. ShopStyle Collective) can be dropped in when request limits and commercial API costs allow.
- **Session-Scoped Storage:** Session state lives in browser `localStorage`. No cross-device database synchronization is required for this privacy-first MVP.
- **No Direct In-App Checkout:** Solved pragmatically via outbound *"Find this for real"* search links for each item.

---

## 8. Reflection & How AI Built This

- **Design Polish:** Applied `taste-skill` and `ui-ux-pro-max` anti-slop guidelines: intentional editorial typography (Cormorant Garamond + Plus Jakarta Sans), rich luxury color palette (warm alabaster, rich espresso, desert gold), and tactile spring physics.
- **Architectural Discipline:** AI is restricted to its strongest capability (translating ambiguous human language to structured schemas) while the ranking and catalog manipulation remains 100% deterministic and testable.
