# Site Architecture — greenneurons.us
**Updated:** 2026-03-10

---

## Single-Page Structure

All content lives in one `index.html`. Sections are anchor-navigated.

### Current Sections (in order)

| Anchor | Label | Status |
|---|---|---|
| `#hero` | Hero / headline | ✅ Live |
| `#capabilities` | Capabilities | ✅ Live |
| `#philosophy` | Philosophy (navy bg) | ✅ Live |
| `#process` | Process | ✅ Live |
| `#tracker` | Intelligence Tool — Supply Chain | ✅ Live |
| `#contact` | Contact / Formspree | ✅ Live |

### Planned Additions

| Anchor | Label | Target |
|---|---|---|
| `#intelligence` | Intelligence Tools (2×2 launcher) | End of March 2026 |

---

## Intelligence Tools Section — Architecture Decision

**Pattern:** Single `#intelligence` section with a tool switcher UI.  
**Rationale:** Avoids multi-file nav/CSS duplication. All tools share site tokens.  
**Scale trigger:** If a tool requires image upload or >500 lines of JS, spin into `/tool-name.html`.

### Tool Switcher Evolution

| Tools | UI |
|---|---|
| 2–3 | Tab bar |
| 4 | 2×2 card launcher → tool panel |
| 5+ | Left sidebar nav |

---

## Deployment Pipeline

```
Edit index.html (VSCode)
  → commit.ps1
    → GitHub (jennysiede/green-neurons-site)
      → Cloudflare Pages (auto-build)
        → greenneurons.us
```

**Commit script:** `C:\Users\green\claude-work\green-neurons\commit.ps1`  
**Cloudflare config:** `wrangler.jsonc`

---

## Design Tokens (quick ref)

See `../brand/design-tokens.md` for full reference.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f5f1eb` | Warm cream — main background |
| `--navy` | `#1a2535` | Deep navy — headings, primary button |
| `--accent` | `#3d5a80` | Slate blue — links, active states |
| `--accent-light` | `#e8eef5` | Pale blue — card backgrounds, hover |
| `--text` | `#1a1612` | Near-black warm — body text |
