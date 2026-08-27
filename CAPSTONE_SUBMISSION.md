# Capstone Portfolio Submission: ZAUQ (ذوق)

## 1. Project Brief
**Zauq** is a gate-free, single-session AI fashion discovery engine designed for individuals seeking occasion-specific outfits without getting bogged down by 30-checkbox filter trees or brittle keyword search queries. Traditional e-commerce platforms struggle to interpret aesthetic and mood descriptors (*"understated old money linen for a coastal dinner"*), while social algorithms prioritize endless doom-scrolling over time-boxed decision resolution. Zauq bridges this gap by combining **natural language semantic interpretation** with a **deterministic scoring client engine** inside a 1-product-at-a-time reels snap-scroll interface.

---

## 2. Live Application & Repository
* **Live Deployment:** [https://zauq-kazwahids-projects.vercel.app](https://zauq-kazwahids-projects.vercel.app) *(or your live custom Vercel domain)*
* **GitHub Repository:** [https://github.com/kazwahid/ZAUQ](https://github.com/kazwahid/ZAUQ)
* **Demo Data Disclosure:** *Demo catalogue: Product names, brands (Atelier Nöir, Studio L'Ombre, Sartoria Vane), prices, and descriptions are synthetic data curated for demonstration purposes.*

---

## 3. Architecture & Meaningful AI Integration
Rather than building an unstructured conversational chatbot that hallucinates inventory, Zauq implements a **Hybrid AI Semantic Parser + Deterministic Client Ranking Engine**:

```
[User Natural Language Prompt]
              │
              ▼
  POST /api/interpret (Edge)
  ├─ In-memory Rate Limiting & Input Validation
  ├─ Grounded Few-Shot Google Gemini Prompt with strict JSON Schema
  └─ Fail-Safe Heuristic Dictionary (150+ synonym ontology fallback)
              │
              ▼
   [Structured JSON Intent]
   { occasion: ["dinner"], pattern: ["linen-texture"], palette: ["earthy"], silhouette: ["tailored"] }
              │
              ▼
 Client Deterministic Scorer (scoring.ts)
  ├─ Multi-weighted Taxonomy Intersections
  ├─ Specificity Cascade Progress (20% → 100%)
  └─ Stable Alphabetical Tie-Breaking (< 5ms latency)
              │
              ▼
 Interactive Discovery View (1-Look Reels Snap Feed + "Why Zauq Picked This" AI Trace)
```

---

## 4. Testing Evidence
All unit and component tests are executed using **Vitest** and `@testing-library/react`.

```
 ✓ src/lib/scoring.test.ts (6 tests)
 ✓ src/components/BreadcrumbChips.test.tsx (4 tests)
 ✓ src/components/Card.test.tsx (3 tests)
 ✓ src/components/BottomDock.test.tsx (3 tests)

 Test Files  4 passed (4)
      Tests  16 passed (16)
   Duration  4.96s
```

---

## 5. Performance & Accessibility Audit (WCAG 2.1 AA)
* **Keyboard Navigation:** Full support for `ArrowDown` / `ArrowUp` / `J` / `K` for vertical snap scrolling, `Tab` for focus cycles, and `Esc` for modal closure.
* **Screen Readers:** All interactive elements feature explicit `aria-label` tags (e.g., `aria-label="Like outfit"`, `aria-label="Refine discovery feed"`).
* **Color Contrast:** All metadata text meets WCAG AA contrast standards ($\ge 4.5:1$).
* **Touch Physics:** Native momentum scrolling enabled with `overscroll-behavior-y: contain` and `-webkit-overflow-scrolling: touch`.

---

## 6. Deployment Checklist & Fail-Safe Verification

| Item | Status | Verification Note |
| :--- | :---: | :--- |
| **Production Build** | ✅ PASS | `npm run build` completed with zero TypeScript errors. |
| **API Key Security** | ✅ PASS | `GEMINI_API_KEY` is strictly confined to server-side edge routes. |
| **Rate Limiting** | ✅ PASS | 45 req/min in-memory IP limiter in `/api/interpret`. |
| **Edge-Case Handling** | ✅ PASS | Empty query, gibberish, and network timeout fallbacks tested. |
| **Rollback Plan** | ✅ PASS | Instant Vercel one-click rollback to prior deployment artifact. |

---

## 7. Engineering Reflection (1 Page)

### What was the hardest part? Why?
The most difficult engineering challenge was balancing **AI flexibility** with **deterministic latency**. When integrating LLMs into user-facing web applications, the temptation is to let the model generate the entire page or conversational reply. However, this introduces variable latencies ($2\text{s} - 6\text{s}$), unpredictable hallucinations of product SKUs, and jittery UI updates. 

Architecting the boundary where the AI stops (extracting structured intent tokens into a fixed JSON contract) and where deterministic code takes over (calculating score weights and sorting in under $5\text{ms}$ on the client) required careful schema engineering and strict Zod validation.

### What would you do differently next time?
If starting from scratch with more time, I would implement **multi-modal visual search embedding vectors** alongside the text taxonomy. Allowing users to upload a photo of a fabric swatch or an inspiration look from Pinterest and projecting that vector into our product space would create an even richer multi-sensory discovery experience.

### One thing learned that surprised you:
I was surprised by how much **perceived intelligence** is driven by UI transparency rather than LLM size. Simply exposing the *"Zauq Understood"* breakdown and adding a 1-line *"Why Zauq Picked This"* badge transformed the product from feeling like a black-box search bar into an attentive, discerning personal stylist.
