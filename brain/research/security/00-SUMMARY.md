# Security Scanning for Plugin Catalogs — Executive Summary

**Research Target:** Deep research of security scanning for plugins/code injection/malware detection in plugin catalogs. Tools: Semgrep, CodeQL, Bandit, ESLint security, npm audit, Snyk, Trivy, VirusTotal, YARA, custom static analysis, sandboxed execution, injection patterns (SQLi, XSS, command injection, prototype pollution, eval, obfuscation). How catalogs handle malicious plugins: quarantine, marking, rewriting.

**Methodology:** Primary sources only (official docs, source repos, vendor documentation). 36 fetches from authoritative sources. All claims trace to saved artifacts in `data/`.

---

## Key Findings

### 1. Layered Defense Required — No Single Tool Suffices

| Layer | Tools | Coverage |
|-------|-------|----------|
| **SAST** | Semgrep (fast, pattern), CodeQL (deep, semantic), Bandit (Python), ESLint (JS/TS) | Source code vulnerabilities |
| **SCA** | npm audit (meta-vuln), Snyk (reachability), Trivy (25 OS + language DBs) | Dependency vulnerabilities |
| **Secrets** | Semgrep/Snyk/Trivy (semantic + entropy + validation) | Hardcoded credentials |
| **Malware** | VirusTotal (sandbox + YARA), YARA-X (pattern matching) | Known malware families, obfuscation |
| **Injection** | All SAST tools via taint tracking / data flow / AST patterns | SQLi, XSS, CMDi, proto pollution, eval |

### 2. AI Agent Plugins Shift Security Left — To Generation Time

Traditional catalogs scan **at publish**. AI agent marketplaces (Claude Code, Cursor) scan **at generation** via hooks:

- **Semgrep Guardian**: MCP server + hooks fire on every file write; scans Code/Supply Chain/Secrets; blocks vulnerable code before commit
- **Snyk Studio**: Guardrail directives (hooks = deterministic) + command directives (`/snyk-fix`); package health hook blocks `npm install` until scan passes
- **Trail of Bits `agentic-actions-auditor`**: Detects 9 attack vectors in GitHub Actions using AI agents (prompt injection, tool misuse, eval of output)

**Implication:** Malicious plugin *behavior* is caught when the agent tries to generate vulnerable code, not when the plugin is published.

### 3. Catalog Malware Handling: Fragmented, Mostly Reactive

| Catalog | Pre-Publish Scan | Quarantine | Marking | Rewriting |
|---------|------------------|------------|---------|-----------|
| **npm** | Provenance/attestations only | ❌ (unpublish restricted) | `deprecated` field | `npm audit fix` (upgrades) |
| **PyPI** | Trusted publishing (OIDC) | ✅ **Yanking** (marks broken, keeps metadata) | `yanked: true`, archived banner | ❌ |
| **VS Code Marketplace** | Undocumented | ❓ | ❓ | ❌ |
| **GitHub Marketplace** | Actions review | ✅ (GHSA advisories) | Dependabot alerts | ✅ (PR fixes) |
| **Claude Code / Cursor** | Manual plugin review | ✅ **Hook blocking** (generation-time) | Baseline suppression | ✅ **Generation-time rewrite** (Snyk/Semgrep loops) |

**Critical Gap:** No catalog implements true quarantine (isolated, non-installable, reviewable). PyPI yanking is closest but still installable with flags.

### 4. Rewriting Exists at Project Level, Not Catalog Level

- **Semgrep**: `--autofix` via YAML rule `fix:` patterns
- **Snyk Agent Fix**: AI-powered remediation loop (scan→fix→validate→PR); 72%→82% merge-ready with Snyk intelligence
- **CodeQL AI Fix** (VS Code): ML fixes from SARIF; confidence scoring (high≥65% auto)
- **npm audit fix**: Minimal version upgrades to `package-lock.json`
- **ESLint `--fix`**: Auto-fix for `🔧 Fixable` rules

**No catalog rewrites published packages** — legal/license barriers; rewriting happens in consumer projects.

### 5. Injection Pattern Detection: Well-Covered by SAST

| Pattern | Primary Detectors |
|---------|-------------------|
| **SQLi** | Semgrep/CodeQL taint tracking; Bandit `injection_sql.py`; Snyk template analysis |
| **XSS** | Semgrep/CodeQL template sink modeling; Bandit Django/Jinja2 rules; Snyk render-time analysis |
| **Command Injection** | Bandit `injection_shell.py` (severity: static→computed); Semgrep `shell=True` patterns |
| **Prototype Pollution** | Semgrep/CodeQL `Object.prototype` patterns; ESLint `no-proto`, `no-extend-native` |
| **eval/dynamic code** | ESLint core (`no-eval`, `no-new-func`); Bandit `exec_used`; Semgrep/CodeQL sink modeling |
| **Obfuscation** | VirusTotal sandbox (`packers`, entropy); YARA high-entropy/base64 patterns; Trivy secret entropy |

### 6. Supply Chain Security for Plugins: Emerging

- **Trusted Publishing** (npm OIDC, PyPI OIDC) — eliminates long-lived tokens
- **Attestations** (PEP 740, npm signatures) — cryptographic proof of build provenance
- **Snyk Agent Supply Chain Security** — validates external MCP servers before agent use
- **Trail of Bits `supply-chain-risk-auditor`** — audits direct deps: advisories, abandoned repos, publisher concentration, install scripts, Scorecard checks

**Gap:** MCP servers (AI agent tool interfaces) are unsigned, unverified executables. No standard for MCP signing/attestation.

### 7. False Positive Management: Structured Processes Emerging

- **Trail of Bits `fp-check`**: Standard (linear) vs Deep (parallel sub-phases) verification; 6 mandatory gate reviews; 13 FP pattern checklist
- **Trail of Bits `vulnerability-triage-brocards`**: 7 brocards for triage (threat model, exploit feasibility, usage context, cost/benefit)
- **Semgrep**: `nosemgrep` comments + baseline files
- **Snyk**: Priority Score (risk-based) + ignore/patched/fixed status
- **Trivy**: `.trivyignore` + `--ignore-unfixed`

---

## Actionable Recommendations

### For Plugin Catalog Operators

1. **Adopt generation-time scanning** for AI agent plugins (Semgrep Guardian / Snyk Studio model)
2. **Implement true quarantine**: Non-installable, reviewable isolation with metadata preservation
3. **Require trusted publishing + attestations** for all plugin submissions
4. **Integrate OSV/GHSA advisory feeds** for post-publish monitoring
5. **Publish malware reporting API** (like npm/PyPI support channels)

### For Plugin Developers

1. **Run Semgrep + CodeQL + npm audit/pip-audit + Trivy** in CI (layered)
2. **Enable Semgrep Guardian / Snyk Studio** in AI-assisted development
3. **Use trusted publishing** (OIDC) — no API tokens in CI
4. **Sign attestations** (PEP 740 / npm signatures) for supply chain integrity

### For Security Teams

1. **Deploy Trail of Bits skills**: `supply-chain-risk-auditor`, `static-analysis`, `variant-analysis`, `fp-check`
2. **Integrate VirusTotal API** for sandbox analysis of suspicious packages
3. **Author YARA-X rules** for organization-specific threat patterns (mutex names, C2 domains)
4. **Establish triage process** using brocards + FP verification gates

---

## Open Questions / Gaps

1. **No standardized pre-publish malware scanning** for traditional plugin catalogs (VS Code, JetBrains, Chrome Web Store)
2. **No cross-catalog malware threat intel sharing** (OSV/GHSA cover vulns, not malware behavior)
3. **MCP server supply chain** — unsigned, unverified; no attestation standard
4. **Catalog-level rewriting** legally/technically blocked
5. **Obfuscation detection** not integrated in catalog pipelines
6. **Prototype pollution / deserialization** rules exist in SAST but not enforced at publish

---

## Source Traceability

All findings trace to primary sources in `H:/susa ai 500/dsh market/harness-market-ds/brain/research/security/data/`:

- **36 raw fetches** from official documentation, GitHub repositories, vendor API docs
- **Queries.log** records every fetch with timestamp
- **01-security.md** contains full detail with source citations per claim
- **Confidence scores** (0-10) assigned per finding based on evidence type

---

*Research completed 2026-11-10. Budget: 36 queries (target 20+). All primary sources.*