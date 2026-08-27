# Zauq (ذوق) — Production Deployment Checklist

**Project:** Zauq Fashion Discovery Feed  
**Sign-off Date:** 2026-08-27  
**Build Target:** Vercel Production Environment  

---

## 1. Pre-Deployment Verification

- [x] **Environment Variables:** `GEMINI_API_KEY` and optional `GEMINI_MODEL` configured in Vercel project dashboard (Never committed to git).
- [x] **Secrets Hygiene:** `.env` and `.env.local` included in `.gitignore`.
- [x] **Local Build Verification:** `npm run build` succeeds cleanly with zero TypeScript or bundling errors.
- [x] **Unit & Component Test Pass:** `npm test` passes 100% of test suites with zero failures.
- [x] **Deterministic Scoring Verified:** Scoring engine verified for reversible breadcrumb addition and removal.

---

## 2. Production Health & Core Loop Checks

- [x] **Initial Feed Load:** Generic 52-item curated fashion feed renders immediately without login or gates.
- [x] **Natural Language Refinement:** Submitting queries (e.g. *"beach vacation"*, *"quiet luxury linen"*, *"silk formal dinner"*) calls `/api/interpret` and spawns removable breadcrumb chips.
- [x] **Deterministic Re-ranking:** Feed reshuffles with Framer Motion transitions matching the accumulated tags.
- [x] **Breadcrumb Removal:** Clicking `×` on any chip immediately removes that filter and re-ranks the feed.
- [x] **Card Action Baseline:** Like (❤️), Skip (✕), and Save (🔖) buttons work accurately on both touch and desktop.
- [x] **Swipe Enhancement:** Touch drag physics trigger like/skip gestures smoothly.
- [x] **Saved Collection Modal:** Drawer opens, displays saved items, and *"Find this for real"* opens Google Shopping search in a new tab.
- [x] **Abuse Protection:** Rate limiting (30 requests/min/IP) and input character caps (120 chars) protect API quota.
- [x] **AI Fallback Resilience:** Serverless route gracefully falls back to deterministic heuristic parsing if the API key is invalid or times out (>6s), notifying the user via a non-blocking toast.

---

## 3. Accessibility & Performance (WCAG 2.1 AA)

- [x] **Keyboard Navigation:** Full keyboard operability (`← Skip`, `→ Like`, `S Save`, `Esc` to close modal, `Tab` order).
- [x] **Contrast Ratio:** Text and buttons exceed 4.5:1 contrast against `#FAF7F2` and dark card overlays.
- [x] **Screen Reader Support:** All interactive buttons have descriptive `aria-label` tags; toasts use `aria-live="polite"`.
- [x] **Target Lighthouse Score:** ≥ 85 on Performance, Accessibility, Best Practices, and SEO.

---

## 4. Rollback & Disaster Recovery Plan

If an unexpected critical issue or runtime regression occurs in production:
1. **Instant Rollback:** In the Vercel Dashboard, navigate to **Deployments** → Select the previous stable deployment → Click **"Instant Rollback" / "Promote to Production"**.
2. **Git Rollback:** Revert commit on `main` and push:
   ```bash
   git revert HEAD
   git push origin main
   ```
3. **Graceful Degraded Mode:** If Gemini API credits expire or outage occurs, Zauq automatically operates in offline heuristic mode with zero downtime.

---

**Signed off by:** Lead Engineer & Designer  
**Status:** Approved for Production Deployment ✅
