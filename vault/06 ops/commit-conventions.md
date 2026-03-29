# Commit Conventions — greenneurons.us
**Last updated:** 2026-03-29  
**Scope:** `jennysiede/green-neurons-site` repo

---

## Prefix Convention

All commit messages use a short prefix to distinguish change type in the GitHub history.

| Prefix | Use |
|---|---|
| `site:` | Changes to `index.html`, `material_costing.html`, or any live page file |
| `vault:` | Vault-only changes — docs, architecture, ops notes, README |
| `ops:` | Tracker data, fetch/update scripts, `.bat` files |
| `config:` | `wrangler.jsonc`, `.gitignore`, `commit.ps1` |
| `assets:` | Static files — images, SVGs, fonts added to repo |

## Examples

```
site: add #color-trends section to index.html
site: wire Substack subscribe button URL
vault: merge site-architecture docs, add 07 assets
vault: add tools-structure.md, update README
ops: update disruptions.json for Red Sea alert
ops: add Reuters trade feed to tracker_fetch.py
config: update wrangler.jsonc with new route
```

## Notes

- No prefix = ambiguous — avoid.
- A single commit can touch vault + site (e.g. adding a section and documenting it) — use the prefix that reflects the primary change. Vault-only sweeps like today's should always be `vault:` so they're easy to skip when reviewing site history.
- `commit.ps1` runs `git add -A` — all changed files go in one commit unless you stage manually first.
