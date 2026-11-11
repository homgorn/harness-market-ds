# ADR-0001: Static-per-locale deployment instead of one build

**Date:** 2026-11-11
**Status:** Accepted

## Context

The catalog holds ~10,600 artifacts (plugins from the community registry plus
desktop apps, hosted services, bots, marketplaces and sites). With seven
locales that is ~74,000 detail pages.

Measured constraint (Cloudflare docs + live API error 10304, 2026-11-11):

- Workers: **20,000 static asset files per Worker version** (Free), 100,000 (Paid)
- Individual asset: 25 MiB
- Static asset **requests are free and unlimited**
- Worker script invocations: 100,000/day (Free), 10 ms CPU each

A full 7-locale static build produced 108,553 files and failed to upload.

Two further amplifiers were found and removed:

- **Pagefind** emitted roughly one index fragment per page — ~72,000 files on
  its own, more than the HTML corpus. Replaced with a compact client-side
  search index.
- Inlining the CSS into every page cost 560 MB of HTML. The stylesheet is now a
  single static asset.

## Decision

Build **per locale** (`BUILD_LOCALES=en,ru,…`), each deployment ~15,400 files —
comfortably under the 20,000 cap on the Free plan. Locales are published as
separate Cloudflare deployments under path prefixes of the same hostname, so
hreflang stays on one domain (Google's preferred setup) rather than scattering
across subdomains.

On the Paid plan (100,000 files) all seven locales ship from a single
deployment.

## Consequences

- Build time per locale ≈ 3 minutes; a full seven-locale build ≈ 20 minutes.
- Deployments are atomic per locale; a failed locale does not block the others.
- Static requests cost nothing, so traffic is unmetered on Cloudflare.
- The Free plan can ship one locale at a time until the plan is upgraded.

## Alternatives considered

| Option | Verdict |
|---|---|
| One static build, all locales | Rejected: 74k+ files exceeds the cap on Free |
| Edge SSR (Astro `output: 'server'`) | Rejected: 10 ms CPU budget, 128 MB memory, and the catalog does not fit the isolate; adds a Worker script invocation per request |
| Multiple subdomains per locale | Rejected: valid for Google but splits link equity and complicates canonicals |
| R2-backed HTML behind a Worker | Viable fallback if the Paid plan is unavailable; adds an R2 read per request |
