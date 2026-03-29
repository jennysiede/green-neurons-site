# Tools Structure — greenneurons.us
**Last updated:** 2026-03-29  
**Status:** Active  
**Scope:** All tools hosted under the greenneurons.us domain — inventory, hosting context, ops notes, and scale triggers

---

## Hosting Model

Tools fall into two categories:

| Type | Description | Examples |
|---|---|---|
| **Inline** | Embedded in `index.html` as a section widget | `#tracker`, `#color-trends` |
| **Standalone** | Separate HTML file under the domain | `material_costing.html` |

**Scale trigger for standalone:** spin a tool out of `index.html` when it requires file upload, >500 lines of JS, or a distinct URL for external linking (e.g. Substack CTA, shared link).

---

## Live Tools

### `#tracker` — Supply Chain Risk Tracker
- **Type:** Inline (`index.html#tracker`)
- **URL:** `greenneurons.us/#tracker`
- **Substack:** No direct link
- **Ops doc:** `tracker-op.md` (this folder) — full fetch/update/deploy cycle
- **Data:** `tracker-data/disruptions.json` → `tracker_update.py` → sentinel block in `index.html`
- **Status:** Stable

---

### `material_costing.html` — Material Costing Calculator
- **Type:** Standalone
- **URL:** `greenneurons.us/material-costing`
- **Substack:** Yes — linked from the **Design Signals Quick Bake** Calculator page as the primary CTA tool
- **Source file:** `C:\Users\green\claude-work\green-neurons\material_costing.html`
- **Dependencies:** Self-contained — no external data, no backend, no shared JS with `index.html`
- **Features:** yards/meters toggle · size run table · waste/shrinkage slider · cuttable width + selvedge deduction logic
- **Deploy:** included in `commit.ps1` (`git add -A` picks it up automatically)
- **Status:** Live

---

## Planned Tools

| Tool | Type | Trigger | Notes |
|---|---|---|---|
| Uniform Cost Estimator | TBD | Spec pending | Likely standalone if form-heavy |
| Fabric/Material Quick-Ref | TBD | Spec pending | Could be inline if read-only |
| Intelligence Tools launcher | Inline (`#intelligence`) | End of March 2026 | 2×2 card → tool panel; see architecture doc |

---

## Adding a New Tool — Decision Flow

```
Does the tool need a shareable URL or is it linked from outside the site?
  YES → standalone HTML file (e.g. /tool-name.html)
  NO  → Does it require file upload or >500 lines of JS?
          YES → standalone
          NO  → inline section in index.html
```

**If standalone:** add an entry to this file, confirm `commit.ps1` will pick it up (it will — `git add -A`), and note any Substack or external link relationship.

**If inline:** add a section entry to `01 architecture/greenneurons.us site-architecture.md` and update the nav if it gets a nav link.

---

## Related Vault Docs

- `01 architecture/greenneurons.us site-architecture.md` — page structure, intelligence tools UI scale triggers
- `04 intelligence-tools/intelligence-tools-strategy.md` — positioning and roadmap for the intelligence tools suite
- `05 substack/substack-strategy.md` — Substack cross-linking strategy, Calculator page context
