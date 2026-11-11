# PDF products — validation checklist (Lemon Squeezy)

PDF is "owned original content" only: specs, reports, handbooks, templates.
Validation happens **before** upload to Lemon Squeezy; LS only hosts and delivers it.

## 1. Content safety
- [ ] No third-party plugin code copied verbatim w/o MIT/Apache attribution.
- [ ] No API keys, tokens, internal URLs, owner's private identity.
- [ ] All "claims" traceable to `site.facts.json` or to source URLs with dates.
- [ ] Disclaimer: "third-party artifacts are community code; install at own risk."
- [ ] AI-generated prose disclosed only if KDP (not needed for LS-direct PDF).

## 2. Format integrity
- [ ] Built with reproducible tool (e.g., pandoc + weasyprint or reportlab).
- [ ] Embedded fonts (subset) — open with Adobe Reader + browser PDF viewer.
- [ ] Print-ready: A4/Letter, 12–18px body, margins, page numbers, TOC.
- [ ] Metadata: Title, Author="DSH Harness Catalog", Subject, Keywords; no
      "Untitled".
- [ ] Links are absolute/stable URLs; internal relative links resolved.
- [ ] File size < LS limit (verify current Lemon Squeezy upload size limit).

## 3. Authenticity & integrity (anti-piracy / provenance)
- [ ] SHA-256 checksum in companion `checksums.txt`.
- [ ] PDF signed (e.g., `gpg --detach-sign`) or includes per-copy license id.
- [ ] Watermark with buyer license id (generated post-purchase via webhook).
- [ ] Version field `PDF-v<X.Y.Z>-<date>` visible in footer.

## 4. Quality gates
- [ ] Spell/grammar pass, consistent terminology (glossary), no TODO markers.
- [ ] Code blocks tested (if including commands — they run).
- [ ] Rendered pages screenshotted for proof (saves to reports/).
- [ ] No placeholder text (Lorem/"example.com" ok only if intentional).
- [ ] Accessibility: document title structure, alt text for images if any.

## 5. Packaging for delivery
- [ ] ZIP with `LICENSE.txt`, `VERSION`, `CHECKSUM.txt`, `README.md`, the PDF.
- [ ] Lemon Squeezy "Upload Files" (dashboard) — product created manually.
- [ ] Webhook → auto-license → optional watermarked build.
- [ ] Updates: version bump = re-upload; buyers get update via email (LS handles).

## 6. Verification scripts (to build)
- `scripts/pdf-validate.mjs` — checks metadata (pdfinfo), link scan, no secrets
  (grep for `sk_`, `gho_`, `cfat_`), TOC present, page count.
- `scripts/pdf-checksum.mjs` — SHA-256 + sign with GPG.
- `scripts/pdf-screenshot.mjs` — render first pages via pdftoppm/Poppler.
