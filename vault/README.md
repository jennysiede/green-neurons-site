# Green Neurons — Site Vault
**Site:** greenneurons.us  
**Legal entity:** Green Neurons Design and Technologies PBC  
**Converted:** August 11, 2021  
**DBA:** Green Neurons Design + Development  
**Parent:** Quinne LLC  
**Deployed:** Cloudflare Pages  
**Repo:** `C:\Users\green\claude-work\green-neurons\`  
**Last updated:** 2026-03-11

---

## Vault Structure

| Folder | Contents |
|---|---|
| `00 archives/` | Dated snapshots, retired docs |
| `01 architecture/` | Site structure, page layout, deployment decisions |
| `02 brand/` | Color tokens, typography, voice/tone reference |
| `03 design-decisions/` | Design token rationale, UX choices, component decisions |
| `04 intelligence-tools/` | Each tool's spec, strategy, and status |
| `05 substack/` | Newsletter strategy, post drafts, cross-linking plan |

---

## Quick Reference — Site Stack

| Layer | Technology |
|---|---|
| Markup | Vanilla HTML · single `index.html` |
| Fonts | Playfair Display · DM Sans · DM Mono (Google Fonts) |
| Deploy | `commit.ps1` → GitHub → Cloudflare Pages auto-build |
| Forms | Formspree |
| Data | Python fetch scripts → `tracker-data/` JSON |

---

## Active Work Threads

- [ ] Color Trends tool → bake into `index.html`
- [ ] 2×2 tool launcher card design (for 4-tool layout)
- [ ] Substack account setup → **Design Signals Quick Bake**
- [ ] Subscribe button → wire to real Substack URL before next commit
- [ ] Uniform Cost Estimator → spec TBD
- [ ] Fabric/Material Quick-Ref → spec TBD
