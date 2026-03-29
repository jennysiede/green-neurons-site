# Site Architecture — greenneurons.us
**Updated:** 2026-03-29

---

## File & Deployment

**Source:** `C:\Users\green\claude-work\green-neurons\index.html`  
**Repo:** `jennysiede/green-neurons-site` (private)  
**Deploy:** Cloudflare Pages — auto-build on push  
**Script:** `commit.ps1` (`-Push` flag triggers remote push)  
**Config:** `wrangler.jsonc`

```
Edit index.html (VSCode)
  → commit.ps1
    → GitHub (jennysiede/green-neurons-site)
      → Cloudflare Pages (auto-build)
        → greenneurons.us
```

---

## Stack

| Layer | Detail |
|---|---|
| Runtime | Single `index.html` — no framework, no build step |
| Fonts | Playfair Display · DM Sans · DM Mono (Google Fonts) |
| Form | Formspree (fetch POST, `application/json`) |
| Animation | CSS `@keyframes fadeUp` + `IntersectionObserver` scroll reveal |
| State | Vanilla JS — all UI state in-memory |

---

## Design Tokens (`<style> :root`)

Full reference: `../02 brand/design-tokens.md`

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f5f1eb` | Warm cream — main canvas |
| `--bg-alt` | `#f0ece4` | Sand — alternate section bg |
| `--bg-card` | `#ffffff` | Card white |
| `--navy` | `#1a2535` | Deep navy — headings, primary CTA |
| `--accent` | `#3d5a80` | Slate blue — links, tags, borders |
| `--accent-light` | `#e8eef5` | Pale blue — hover, card bg |
| `--accent-mid` | `#6b8cae` | Muted accent, stat numbers |
| `--text` | `#1a1612` | Near-black warm — body |
| `--text-mid` | `#6b6258` | Mid body |
| `--text-muted` | `#9e9288` | Labels, captions |
| `--serif` | Playfair Display | h1, h2, quotes, card titles |
| `--sans` | DM Sans | Body, nav, buttons |
| `--mono` | DM Mono | Labels, tags, eyebrows, form meta |
| `--section-pad` | `100px` | Top/bottom on every `<section>` |

Risk badge tokens (`--risk-low/med/crit-*`) are scoped to the Supply Chain Tracker widget only.

---

## Page Structure (top → bottom)

```
<nav>                   fixed, 64px, blur backdrop
<section #hero>         100vh, fadeUp animations, 2 CTAs
<section #capabilities> cream bg, 3-col cap-grid cards
<section #philosophy>   navy bg, 2-col quote + stat-grid
<section #process>      cream bg, 4-step dot timeline
<section #tracker>      sand bg, interactive supply chain widget
<section #color-trends> cream bg, palette selector + Substack strip
<section #contact>      cream bg, 2-col info + Formspree form
<footer>                navy bg, 3-col links + tagline
```

### Planned additions

| Anchor | Label | Target |
|---|---|---|
| `#intelligence` | Intelligence Tools (2×2 launcher) | End of March 2026 |

---

## Navigation

Fixed bar, `z-index: 200`, cream bg at 92% opacity + `backdrop-filter: blur(8px)`.

| Label | Target |
|---|---|
| Capabilities | `#capabilities` |
| Philosophy | `#philosophy` |
| Process | `#process` |
| Tracker | `#tracker` |
| Contact | `#contact` |

Logo: `.nav-logo` → `href="#hero"` (smooth scroll). No external nav links.

---

## Sections

### `#hero`
- Eyebrow: mono label + 32px accent rule
- `<h1>` with `<em>` italic accent word
- Sub-headline (DM Sans 300)
- CTAs: `.btn-primary` → `#contact` · `.btn-ghost` → `#capabilities`
- Radial gradient orb (top-right, decorative, `pointer-events: none`)

### `#capabilities`
Grid of 6 cards (`.cap-card`), `auto-fill minmax(300px, 1fr)`. Each card: mono number · serif title · sans description · mono tags. Hover: `accent-light` bg + accent underline sweep.

| # | Title | Tags |
|---|---|---|
| 01 | Fabric Intelligence Systems | `Neurowēv · ontology · simulation` |
| 02 | Agentic Design Workflows | `M.Ai.D.E · automation · LLM` |
| 03 | Technical Design Infrastructure | `tech packs · costing · spec` |
| 04 | Supply Chain Intelligence | `sourcing · risk · logistics` |
| 05 | Wearable Systems Architecture | `IoT · BLE · embedded` |
| 06 | Research Data Infrastructure | `FHIR · pipelines · viz` |

### `#philosophy`
Navy bg. 2-col: left = blockquote + body copy; right = 2×2 stat grid.  
Stats: `12→` iterations reduced · `0` wasted samples · `48h` prototype window · `∞` domain combinations

### `#process`
4-step horizontal timeline with dot + connecting rule:  
`01 Brief → 02 Architect → 03 Build → 04 Deploy`

### `#tracker` *(interactive widget)*
Supply Chain Risk Tracker. Country tabs (Bangladesh · Vietnam · China · Mexico · Turkey) drive route cards. Each route: name, path string, transit days, risk level (low/med/critical), status (operational/disrupted), expandable detail with leg chips, cost bar, disruptions list, analyst note. Last Mile panel below.

JS: `ROUTES` data object → `renderTracker()` → DOM. Country tab click updates `activeCountry`. Card header click toggles `expandedIndex`.

### `#color-trends` *(interactive widget)*
3 PFW SS25 palette cards (Dissolution · Immersion · Residue). Click to select → updates swatch display. Each swatch: click to copy hex. "Export CSS" copies `:root {}` variable block to clipboard. Substack strip links to `greenneurons.substack.com`.

### `#contact`
2-col: left = info block + `.contact-meta` (email, location, response window); right = Formspree form.

| Field | Type | `name` attr |
|---|---|---|
| Name | text | `name` |
| Email | email | `email` |
| Company | text | `company` |
| Project type | select | `project` |
| Message | textarea | `message` |

Form behavior: `fetch` POST → Formspree → inline `.form-status`. No page reload. Error + network failure states handled.

### `<footer>`
Navy bg. 3-col: brand blurb · nav links · connect links (Substack, GitHub `jennysiede`, LinkedIn).

---

## JavaScript Modules (inline `<script>`)

| Module | Function | Notes |
|---|---|---|
| Scroll reveal | `IntersectionObserver` on `.reveal` | `threshold: 0.1`, fires once |
| Contact form | `fetch` POST on submit | Formspree, JSON accept header |
| Tracker | `renderTracker()` | Reads `ROUTES`, `activeCountry`, `expandedIndex` |
| Color Trends | `renderPaletteGrid()` + `renderPaletteDisplay()` | Reads `PFW_PALETTES[activePalette]` |
| Hex copy | `copyHex(hex, el)` | `navigator.clipboard.writeText` |
| CSS export | `exportPaletteCSS()` | Writes `:root {}` block to clipboard |
| Init | `renderTracker()` at bottom | Palettes also init at bottom |

---

## External Links

| Destination | Location |
|---|---|
| `greenneurons.substack.com` | Color Trends strip + Footer |
| `github.com/jennysiede` | Footer |
| LinkedIn (placeholder) | Footer |
| Formspree endpoint | Form `action` attr (hardcoded — see Known gaps) |
| Google Fonts | `<head>` preconnect + stylesheet |

---

## Tools Inventory

Full ops detail for each tool lives in `../06 ops/tools-structure.md`.

| Tool | Type | URL | Substack |
|---|---|---|---|
| Supply Chain Tracker | Inline (`#tracker`) | `greenneurons.us/#tracker` | No |
| Material Costing Calculator | Standalone (`material_costing.html`) | `greenneurons.us/material-costing` | Yes — Calculator page CTA |

**Scale trigger:** spin a tool out of `index.html` when it needs a shareable URL, file upload, or >500 lines of JS.

---

## Intelligence Tools Section — Architecture Decision

**Pattern:** Single `#intelligence` section with a tool switcher UI.  
**Rationale:** Avoids multi-file nav/CSS duplication. All tools share site tokens.  
**Scale trigger:** If a tool requires image upload or >500 lines of JS, spin into `/tool-name.html`.

| Tool count | UI pattern |
|---|---|
| 2–3 | Tab bar |
| 4 | 2×2 card launcher → tool panel |
| 5+ | Left sidebar nav |

---

## Responsive Breakpoints

No named breakpoint system — targeted `@media (max-width: 768px)` only:
- `.palette-grid` collapses to 1 col
- `.substack-strip` goes column-direction
- `#philosophy`, `#process`, `#contact` 2/4-col grids have no explicit mobile override (reflow gap — see Known gaps)

---

## Known Gaps

- No explicit `@media` override for `#philosophy`, `#process`, or `#contact` multi-col grids
- No `<meta og:*>` or Twitter card tags
- Formspree endpoint hardcoded in `action` attr — not in config or env
- No `robots.txt` or `sitemap.xml` in repo

---

## Assets

Visual reference materials live in `../07 assets/`:

| File | Description |
|---|---|
| `greenneurons-site-doc.md` | Wrapper → this file |
| `greenneurons_site_structure.svg` | Section layout + link diagram |
