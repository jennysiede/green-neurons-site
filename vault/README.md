# Green Neurons — Site Vault
**Site:** greenneurons.us  
**Legal entity:** Green Neurons Design and Technologies PBC  
**DBA:** Green Neurons Design + Development  
**Parent:** Quinne LLC  
**Deployed:** Cloudflare Pages  
**Repo:** `C:\Users\green\claude-work\green-neurons\`  
**Last updated:** 2026-03-29

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
| `06 ops/` | Ops runbooks — tracker feed, tools structure, deploy cycles |
| `07 assets/` | Visual reference materials — diagrams, wrappers |

---

## Key Documents

| File | Description |
|---|---|
| `01 architecture/greenneurons.us site-architecture.md` | Canonical site reference — stack, sections, tokens, JS modules, tools inventory, known gaps |
| `01 architecture/structure-03112026.md` | Vault folder tree (updated 2026-03-29) |
| `06 ops/tools-structure.md` | All domain-hosted tools — inventory, hosting model, Substack relationships, decision flow |
| `06 ops/tracker-op.md` | Supply chain tracker — fetch/update/deploy cycle |
| `06 ops/commit-conventions.md` | Commit message prefix convention for repo history |
| `07 assets/greenneurons_site_structure.svg` | Section layout + nav links + contact form diagram |
| `07 assets/greenneurons-site-doc.md` | Wrapper → `01 architecture/greenneurons.us site-architecture.md` |

---

## Quick Reference — Site Stack

| Layer | Technology |
|---|---|
| Markup | Vanilla HTML · single `index.html` |
| Fonts | Playfair Display · DM Sans · DM Mono (Google Fonts) |
| Deploy | `commit.ps1` → GitHub → Cloudflare Pages auto-build |
| Forms | Formspree |

---

## Active Work Threads

- [x] Color Trends tool → baked into `index.html` ✅
- [x] Substack account setup → **Design Signals Quick Bake** ✅ live at greenneurons.substack.com
- [x] Subscribe button → wired to Substack URL ✅
- [x] Material Costing Calculator → live at `greenneurons.us/material-costing` ✅
- [ ] 2×2 tool launcher card design (for 4-tool layout)
- [ ] `#intelligence` section → planned end of March 2026
- [ ] Mobile breakpoints → `#philosophy`, `#process`, `#contact` grids unhandled
- [ ] OG/Twitter card meta tags → missing
- [ ] `robots.txt` + `sitemap.xml` → not in repo
- [ ] Formspree endpoint → move out of hardcoded `action` attr
- [ ] Uniform Cost Estimator → spec TBD
- [ ] Fabric/Material Quick-Ref → spec TBD
