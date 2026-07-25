# Color Trends Tracker — Update Plan
**Target:** `index.html` → `#color-trends` section + `PFW_PALETTES` array
**Prepared:** 2026-07-25
**Source set:** `C:\Users\green\Downloads\COLORS` — Balenciaga FW26 Couture · Lanvin Resort 27 · Samuel Guì Yang FW26 RTW (Shanghai) · Jacquemus SS27 RTW
**Scope agreed:** content swap **+** JSON pipeline extraction · add Pantone TCX reference to exports

> **STATUS 2026-07-25 — hardcoded pass SHIPPED.** Sections 3, 5 and the copy edits in 4c are done directly in `index.html`.
> JS sentinels `/* COLOR-PALETTES-START */ … /* COLOR-PALETTES-END */` are already in place, so **section 4 (JSON + `color_update.py`) is now a drop-in** whenever you want it — the extraction point exists, nothing needs re-cutting.
> Still open: `palettes.json`, `color_update.py`, `color_update.bat`, archiving SS25, doc updates (step 9).

---

## 1. Current state — audit

The Color Trends tool is the only Intelligence Tool still hardcoded. Here's what's actually there:

| Item | Location | Value |
|---|---|---|
| Palette data | `index.html` ~line 1669 | `const PFW_PALETTES = [...]` — inline JS, 3 groups × 5 colors |
| Themes | same | Dissolution · Immersion · Residue |
| Season stamp (per palette) | same, ×3 | `season:'SS25 · Paris'` |
| Season stamp (meta strip) | ~line 1296 | `Season: Spring / Summer 2025 · Paris` |
| Season stamp (intro copy) | ~line 1290 | `...from Paris Fashion Week — three curated palette groups` |
| Render functions | ~1681–1725 | `renderPaletteGrid()` · `renderPaletteDisplay()` · `selectPalette()` |
| Exports | ~1735 | `exportPaletteCSS()` — CSS custom properties only |

### Seven gaps worth naming

1. **Content is four seasons stale.** SS25 in a July 2026 build. Your own strategy doc sets Color Trends cadence at *quarterly*.
2. **No data file.** Route Tracker has `tracker-data/disruptions.json` + `tracker_update.py` + sentinel comments. Color has none of that — every seasonal refresh means hand-editing inline JS inside an 86,000-line HTML file. This is the real problem; staleness is just the symptom.
3. **No freshness stamp.** Design Principle #1 in your strategy doc is *"every tool shows last updated date."* Route Tracker complies. Color Trends doesn't — it shows a season, which is not the same thing as a review date.
4. **Season label duplicated in 3+ places.** Guaranteed to drift on a hurried update.
5. **No source attribution.** Palettes are abstract moods with no traceable origin. A sourcing audience wants to know *which collection* a red came from — and you now have that data.
6. **Exports are CSS-only.** Useful to a web developer, not to a dyehouse. Pantone TCX is the missing bridge.
7. **Stale HTML comment.** Line ~1284 reads `<!-- ── CONTACT ── -->` directly above `<section id="color-trends">`. Cosmetic, but fix it while you're in there.

---

## 2. Scope recommendation — you had no preference, so here's my call

**Broaden to multi-city. Retitle "Paris Fashion Week Color Trends" → "Runway Color Trends."**

Reasoning: three of your four source collections aren't Paris RTW anyway — Balenciaga FW26 is *couture*, Lanvin Resort 27 is a *lookbook*, and Samuel Guì Yang shows in Shanghai. The PFW frame was already straining. Broadening also decouples the tool from one city's calendar, which matters because Resort and Pre-Fall are exactly where commercial color decisions get made, and neither happens during PFW.

Keep per-palette attribution honest by using the existing `season` field to carry collection + city (`FW26 Couture · Paris`, `FW26 RTW · Shanghai`). The field already renders on both the card and the display header — no CSS change needed.

**Copy changes:**
- `<h2>`: `Paris Fashion Week<br><em>Color Trends</em>` → `Runway<br><em>Color Trends</em>`
- Intro: `Runway chromatic intelligence from Paris Fashion Week — three curated palette groups, 5 colors each.` → `Runway chromatic intelligence across the international show calendar — three curated palette groups, 5 colors each, extracted from source imagery and attributed to collection.`
- Nav label and `#color-trends` id: **leave alone.** Renaming the anchor breaks any existing inbound Substack links for zero gain.

---

## 3. The new palette data

Consolidated from six extracted color families into three groups of five, so it drops into the existing structure with no markup or CSS changes. Names follow your house convention — abstract, material-referential, two words.

### Group 1 — `Rouge Libre`
*Descriptor:* "Chroma carried whole-garment, dyed to depth rather than blocked"
*Season:* `FW26–R27 · Paris`

| Hex | Name | Source |
|---|---|---|
| `#CA141E` | Signal Vermilion | Balenciaga FW26 Couture — fringe gown |
| `#A80624` | Crimson Depth | Lanvin Resort 27 — pleated set |
| `#8A0648` | Magenta Ground | Balenciaga FW26 Couture — hood gown, deepest pass |
| `#E53F90` | Fuchsia Haze | Balenciaga FW26 Couture — mid ombré |
| `#F770BA` | Organza Blush | Balenciaga FW26 Couture — sheer highlight |

### Group 2 — `Nature Reload`
*Descriptor:* "Unbleached, unfinished — neutral as material honesty"
*Season:* `FW26 · Shanghai / Paris`

| Hex | Name | Source |
|---|---|---|
| `#EFEDEA` | Raw Bone | Lanvin Resort 27 — shirtdress |
| `#EBE3DD` | Waffle Cream | Samuel Guì Yang FW26 — cape jacket |
| `#D7C9B2` | Oat Ground | Samuel Guì Yang FW26 — skirt |
| `#C8B79C` | Unbleached Linen | Samuel Guì Yang FW26 — knit |
| `#93775A` | Earth Bind | Jacquemus SS27 — tailoring |

### Group 3 — `Marine Springs`
*Descriptor:* "Pigment cooled — water, stone, and one sugared green"
*Season:* `FW26–SS27 · Shanghai / Paris`

| Hex | Name | Source |
|---|---|---|
| `#19394C` | Ink Indigo | Samuel Guì Yang FW26 — deep shadow |
| `#426F88` | Mineral Blue | Samuel Guì Yang FW26 — mandarin set |
| `#679CBB` | Faded Chambray | Samuel Guì Yang FW26 — sheer linen |
| `#10726D` | Viridian Deep | Balenciaga FW26 Couture — petal dress |
| `#A8C5AE` | Sugared Mint | Jacquemus SS27 — pleated trouser |

**Note the deliberate choice:** each group is now a *tonal ladder within one hue family* rather than a spread of unrelated colors. That's not a formatting decision — it's the actual finding from the source set. Saturation this season arrives as dye depth, not as color-blocking. The old palettes (Dissolution/Immersion/Residue) already leaned this way, so the tool's visual language holds.

---

## 4. Pipeline extraction — mirroring the Route Tracker

The goal: seasonal refresh becomes *edit JSON → double-click a .bat*, exactly like disruptions.

### 4a. New data file — `tracker-data/palettes.json`

```json
{
  "last_reviewed": "2026-07-25",
  "tool_title": "Runway Color Trends",
  "meta_line": "FW26–SS27 · Paris / Shanghai",
  "palettes": [
    {
      "id": 1,
      "theme": "Saturation",
      "descriptor": "Chroma carried whole-garment, dyed to depth rather than blocked",
      "season": "FW26–R27 · Paris",
      "active": true,
      "colors": [
        { "hex": "#CA141E", "name": "Signal Vermilion", "tcx": "18-1662 TCX", "source": "Balenciaga FW26 Couture" }
      ]
    }
  ],
  "notes": "Hand-curated quarterly. Run color_update.bat after editing to rebuild index.html and deploy.",
  "archive": []
}
```

Two fields earn their keep beyond the obvious:
- **`active`** — same semantics as disruptions. Lets you stage next season's palette in the file without publishing it.
- **`archive`** — retired palettes move here instead of being deleted. Feeds the Substack "memory layer" idea in your strategy doc (Design Principle #6) — SS25's Dissolution becomes a reference post, and you still have the hexes.

### 4b. New script — `color_update.py`

Copy `tracker_update.py` and change four things. The structure is already proven, so this is genuinely a fork-and-edit, not a build:

| Change | From | To |
|---|---|---|
| `DATA_FILE` | `disruptions.json` | `palettes.json` |
| Sentinels | `<!-- TRACKER-ALERTS-START/END -->` | `/* COLOR-PALETTES-START */` … `/* COLOR-PALETTES-END */` |
| Builder fn | `build_alert_html()` | `build_palettes_js()` — emits the `PFW_PALETTES` const |
| Date target | tracker footnote | new Color Trends "Last reviewed" line |

**One important difference from the tracker:** the color block lives *inside* `<script>`, not in HTML. So the sentinels must be **JS comments** (`/* ... */`), not HTML comments. An HTML comment there would either break parsing or be silently ignored depending on placement — don't reuse the `<!-- -->` form.

Keep `--dry-run`. Keep the `commit.ps1` chain at the end. Retain the const name `PFW_PALETTES` even after the retitle — renaming it means touching four render functions for no functional benefit. Add a one-line comment noting the name is historical.

### 4c. `index.html` edits

Replace the inline array with the sentinel-wrapped block:

```javascript
/* COLOR-PALETTES-START */
const PFW_PALETTES = [ /* generated by color_update.py — do not hand-edit */ ];
/* COLOR-PALETTES-END */
```

Then add the missing freshness stamp inside `.color-trends-meta` (~line 1296):

```html
<div class="color-trends-meta reveal">
  <span>Season: FW26–SS27 · Paris / Shanghai</span>
  <span>Last reviewed: 2026-07-25</span>
  <span class="highlight">3 palette groups · 15 colors</span>
</div>
```

The existing `.color-trends-meta` CSS is a flex row of `span`s, so a third child needs no new rules. Verify it doesn't wrap awkwardly at ~380px — if it does, that's a one-line `flex-wrap: wrap` on the container, nothing more.

### 4d. New launcher — `color_update.bat`

Two lines, mirroring `tracker_update.bat`:

```bat
@echo off
python "%~dp0color_update.py" %*
```

---

## 5. Pantone TCX reference

The approved export add. Two ways to do it — I'd start narrow:

**Recommended: hand-map 15 codes into the JSON `tcx` field.** Fifteen colors, done once per season, and the value lands where it matters — the swatch card shows the TCX code next to the hex, and Export CSS gains a commented TCX line. No dependency, no license question, no algorithm to defend.

**Not recommended yet: computed nearest-TCX in JS.** It needs the full ~2,600-entry TCX table embedded (a meaningful page-weight hit on a single-page site) and it would need to be Lab/ΔE-based to be credible — RGB-distance nearest-neighbour gives visibly wrong matches on saturated reds, which is precisely the family this season leans on. Revisit if the tool ever spins out standalone.

**Accuracy caveat to put in the UI, not just the docs:** these are visual references from photographed runway imagery under uncontrolled light, not measured lab values. One line of small text under the swatches — `TCX codes are visual references from runway imagery, not measured standards. Confirm against physical swatch before dyehouse submit.` This protects you and it's the kind of candour your sourcing audience reads as competence rather than hedging.

---

## 6. Sequence

| # | Step | Est. |
|---|---|---|
| 1 | Create `tracker-data/palettes.json` with the 3 new palettes + TCX codes | 30 min |
| 2 | Fork `tracker_update.py` → `color_update.py`, swap the four items in 4b | 45 min |
| 3 | Insert JS sentinels in `index.html`, remove hardcoded array | 10 min |
| 4 | Copy edits — `<h2>`, intro, meta strip, fix the stale `CONTACT` comment | 15 min |
| 5 | Add `tcx` to swatch render + TCX caveat line | 20 min |
| 6 | `color_update.bat` launcher | 5 min |
| 7 | `python color_update.py --dry-run`, eyeball the generated JS | 10 min |
| 8 | Run live, confirm Cloudflare deploy, check mobile + click-to-copy | 20 min |
| 9 | Move SS25 palettes into `archive[]`; update `tools-structure.md` and `intelligence-tools-strategy.md` | 20 min |

**~3 hours,** most of it one-time pipeline work. Next season is steps 1 and 8 only — about 40 minutes.

---

## 7. Verification checklist

- [ ] `--dry-run` output is valid JS — paste into a browser console and confirm it parses
- [ ] All three palette cards render; clicking each switches the display panel
- [ ] Click-to-copy still writes to clipboard and shows the `✓ copied` state
- [ ] Export CSS produces valid custom-property names from the new color names (`--signal-vermilion` — check no double hyphens from the `replace(/\s+/g,'-')`)
- [ ] `Last reviewed` date matches `palettes.json`
- [ ] Meta strip doesn't wrap badly at 380px
- [ ] Route Tracker still works — you've shared `commit.ps1`, so confirm nothing regressed
- [ ] `gn-techpack` rebuild fires as expected (per TRACKER.md this is normal, not a fault)

---

## 8. Deferred — worth logging, not doing now

**Silhouette dimension.** You have the analysis (`TREND_analysis.md` in the COLORS folder) and no competitor tool pairs color with silhouette. That's real differentiation, and the strategy doc's 2×2 launcher is the natural home for it. Scoped as its own tool rather than bolted onto this one.

**Palette PDF.** Still unbuilt from the March strategy doc. Strongest as a Substack lead magnet, so it should probably wait until the Substack cadence is established.

**Cross-tool nudge.** Design Principle #5 calls for contextual links between tools, and Color Trends currently has none. A single line under the palette display — *"Sourcing these colors? Check current transit risk for your dye origin →"* pointing at `#tracker` — costs one `<a>` tag and is the cheapest unbuilt item on your own list.

---

## One thing I'd push back on

Your strategy doc sets Color Trends at **quarterly**, but the tool sat on SS25 for roughly four seasons. That gap suggests the cadence wasn't the constraint — the friction of hand-editing inline JS was. The pipeline in section 4 is the actual fix, which is why I'd resist doing the content swap alone even though it ships faster. If step 2 slips, do steps 1–3 anyway and hand-run the script; a JSON file with no automation is still dramatically better than an array buried at line 1669.
