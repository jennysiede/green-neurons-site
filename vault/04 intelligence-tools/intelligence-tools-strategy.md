# Intelligence Tools Strategy
**Project:** Green Neurons — greenneurons.us  
**Date:** 2026-03-10  
**Status:** Planning · Pre-commit  
**Substack:** Design Signals Quick Bake *(confirmed name)*

---

## Context

The current `index.html` has one Intelligence Tool: the **Supply Chain Route Interruption tracker** (`#tracker` section). This strategy covers expanding to four tools by end of March 2026.

---

## The Four Tools (target: end of March 2026)

| # | Tool | Data type | Update cadence | Status |
|---|---|---|---|---|
| 1 | Supply Chain Route Interruption | Live/curated | Weekly | ✅ Live |
| 2 | PFW Color Trends Palettes | Seasonal | Quarterly | 🔧 Prototype (JSX) |
| 3 | Fabric/Material Specification Quick-Ref | Reference | As-needed | 📋 To spec |
| 4 | Uniform Cost Estimator | Calculator | Stable | 📋 To spec |

Tools 3 and 4 are directly tied to Green Neurons' hospitality/private club positioning and Neurowēv expertise.

---

## Architecture Decision

**Stay single-page.** All tools in `index.html` under `#intelligence` section.  
See `../architecture/site-architecture.md` for full rationale.

**UI evolution:**
- 2–3 tools → tab bar  
- 4 tools → **2×2 card launcher** (next build target)
- 5+ → left sidebar nav

---

## Design Principles for Stickiness

**1. Freshness signals** — every tool shows "last updated" date. Users return when data rotates.

**2. Zero friction** — no login, no signup wall. Substack subscribe is the soft ask below the tools.

**3. Export something** — give users a deliverable to take away:
- Color Trends → copy hex / Export CSS / palette PDF
- Cost Estimator → rough spec sheet download
- Supply Chain → shareable alert summary

**4. Progressive depth** — surface (10 sec scan) + depth (2 min exploration). Collapsible cards, palette selectors.

**5. Cross-tool linking** — contextual nudges between tools make the suite feel like a system:
- *"Using these palettes? Check current sourcing delays for Bangladesh →"*
- *"Estimating uniform cost? See Red Sea rerouting impact on lead times →"*

**6. Substack as memory layer** — tools are ephemeral; Substack archives the moment. SS25 palette report in March becomes a reference post by September.

---

## Open Items

- [ ] Color Trends → convert JSX prototype to vanilla HTML/CSS/JS, bake into `index.html`
- [ ] Design 2×2 tool launcher card layout (mock-up pending)
- [ ] Spec Tool 3: Fabric/Material Quick-Ref (content scope TBD)
- [ ] Spec Tool 4: Uniform Cost Estimator (inputs: garment type, qty, decoration → MOQ + cost range)
- [ ] Substack subscribe button → wire to real URL before next commit
