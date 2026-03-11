# Email Setup — greenneurons.us
**Updated:** 2026-03-11  
**Status:** Complete for current needs ✅

---

## Architecture (current)

Cloudflare Email Routing (free) → receives at hello@greenneurons.us → forwards to jenny.siede@gmail.com

---

## Addresses Status

| Address | Status | Destination |
|---|---|---|
| `hello@greenneurons.us` | ✅ Active — receives only | jenny.siede@gmail.com |
| `jenny@greenneurons.us` | Optional — add anytime | jenny.siede@gmail.com |

---

## What Works Now

- ✅ `hello@greenneurons.us` receives mail → arrives in Gmail
- ✅ Ready to use for Substack account signup
- ✅ Ready to use for Formspree contact form destination
- ✅ Catch-all set to Drop — blocks spam to random addresses

## Current Limitation

- Replies go from `jenny.siede@gmail.com` — acceptable for now
- Gmail Send As blocked: passkeys account prevents App Passwords, Gmail forces SMTP

---

## Future Path — Google Workspace

When sending as `jenny@greenneurons.us` becomes important (client proposals, newsletters):

**Google Workspace ~$6/month** gives a proper mailbox with no SMTP workarounds.

**Setup is simple because Cloudflare manages DNS:**
1. Sign up at workspace.google.com → add greenneurons.us as domain
2. Google provides MX records
3. Add MX records in Cloudflare DNS panel → takes ~10 min
4. No site disruption, no hosting migration
5. Cloudflare Email Routing automatically defers to Workspace MX records

This is a known, clean upgrade path — no blockers.

---

## Checklist

- [x] Cloudflare Email Routing enabled ✅
- [x] `hello@greenneurons.us` forwarding to Gmail ✅
- [ ] Use `hello@greenneurons.us` for Substack signup ← next
- [ ] Update Formspree in `index.html` to use hello@greenneurons.us
- [ ] Google Workspace — when ready (future)
