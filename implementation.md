# Implementation Log

## Audit — 2026-05-10

Post-Netlify-migration hardening pass. Findings from code/config audit of Cloudflare Pages Functions, Decap CMS config, forms, and build pipeline.

### Critical
- [x] C1 — Drop redundant `addPassthroughCopy` for `orcamento`/`legal` dirs in `.eleventy.js`; raw `.njk` templates leak to public `_site/`
- [x] C2 — Tighten OAuth scope in `functions/api/auth.js` from `repo user` to just `repo`

### High
- [x] H1 — Pin `postMessage` target origin in `functions/api/callback.js` (replace `'*'` with computed origin) to prevent token exfiltration
- [x] H2 — Add `REPORTE_OTIMIZACAO_SEO_2026.md`, `*.log`, `*.ai` to Eleventy ignores so internal docs/logs don't leak to `_site/`

### Medium
- [x] M1 — Cap contact-form `extras` size + sanitize subject newlines/length in `functions/api/contact.js`
- [x] M2 — Add `Strict-Transport-Security` header to `_headers`
- [x] M3 — Pin Decap CMS version in `admin/index.html` (replace `^3.0.0` with `3.12.2`)
- [x] M4 — Tighten OAuth state cookie `Path` from `/` to `/api/callback` in `auth.js` and `callback.js`

### Low
- [x] L1 — Improve callback `User-Agent` to include contact URL per GitHub recommendation
- [x] L2 — Add `dev:functions` script to `package.json` for local function testing via `wrangler pages dev`

### Deferred
- Rate limiting on contact form (needs CF KV/Turnstile — separate work)
- SRI hash for Decap bundle
- Self-hosting Decap bundle
- DRY-ing `escapeHtml` across functions (micro-optimization)
