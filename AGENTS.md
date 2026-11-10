# AGENTS.md — harness-market-ds

## Project
DSH Harness Plugin Catalog: Astro + Cloudflare Pages, multilingual (7 locales), SEO/GEO/AEO, security-scanned, daily CDN sync. Subdomain harness-market-ds.refertur.net.

## Guardrails (verbatim, non-negotiable)

1. Never delete without double confirmation. Moving/renaming counts. Soft-delete to `.trash/` first.
2. Never invent a fact. Every number traces to a measurement artifact (`site.facts.json`).
3. Never fabricate identity (INN, address, phone, review, price). Omit key rather than invent.
4. Apex domain refertur.net is untouchable. Subdomain only via CNAME.
5. Secrets never in git/docs. `.env` only, `.env.example` with empty values.
6. Free models only for agents.
7. Verify, don't claim. Deployed = HTTP 200 on public URL.

## Agent sandboxing
- One agent owns one directory. Write roots named in brief.
- No rm/git clean/reset --hard/push --force/branch -D without owner confirmation.
- No DNS/Cloudflare/GitHub settings/secrets changes by agents.
- Every agent writes report to reports/<agent-id>/.

## Write roots
- src/ — general agent (UI/components)
- scripts/ — general agent (pipeline)
- data/ — scraper agent
- brain/ — researcher/general (docs/wiki)
- docs/ — architect/general
- tests/ — general

## Model chain
primary: openrouter/nvidia/nemotron-3-ultra-550b-a55b:free
fallback1: openrouter/thinkingmachines/inkling:free
fallback2: opencode/beam-free
last resort: stop and report.

## Verification
Run `node scripts/forge/gates.mjs --all` before declaring done. Self-critique pass + second gate run.
