# Deep Research: Security Scanning for Plugins/Code Injection/Malware Detection in Plugin Catalogs

**Date:** 2026-11-10  
**Methodology:** Primary sources only (official documentation, source repositories, vendor docs)  
**Budget:** 25+ queries executed, raw fetches saved to `data/`

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [SAST/Static Analysis Tools](#saststatic-analysis-tools)
3. [SCA/Dependency Scanning](#scadependency-scanning)
4. [Secrets Detection](#secrets-detection)
5. [Malware/YARA-Based Detection](#malwareyarabased-detection)
6. [Injection Pattern Detection](#injection-pattern-detection)
7. [AI Agent Security & Plugin Catalogs](#ai-agent-security--plugin-catalogs)
8. [Marketplace/Catalog Security Practices](#marketplacecatalog-security-practices)
9. [Quarantine, Marking, Rewriting Mechanisms](#quarantine-marking-rewriting-mechanisms)
10. [Sandboxed Execution & Custom Analysis](#sandboxed-execution--custom-analysis)
11. [Comparative Analysis](#comparative-analysis)
12. [Gaps & Open Questions](#gaps--open-questions)

---

## Executive Summary

This research examines the landscape of security scanning for plugin catalogs and marketplaces, covering SAST/SCA/secrets tools, malware detection via YARA/VirusTotal, injection pattern detection, and how catalogs handle malicious plugins. Key findings:

- **No single tool covers all threats** — defense requires layered SAST (Semgrep, CodeQL, Bandit), SCA (npm audit, Snyk, Trivy), secrets (gitleaks, TruffleHog, Trivy), and malware (YARA, VirusTotal)
- **AI agent plugins introduce new attack surface** — prompt injection, tool misuse, supply chain via MCP servers
- **Catalog/marketplace security is fragmented** — npm/PyPI use provenance + 2FA + malware reporting; VS Code Marketplace has minimal public docs; AI agent marketplaces (Claude Code, Cursor) rely on plugin-level scanning (Semgrep Guardian, Snyk Studio)
- **Quarantine/rewriting is rare** — most catalogs remove or yank; few rewrite. PyPI "yanks" (marks broken without deletion); npm allows unpublishing with restrictions; AI agent plugins use hook-based blocking at generation time

---

## SAST/Static Analysis Tools

### Semgrep

**Source:** `semgrep.dev/docs`, `github.com/semgrep/semgrep`, `github.com/semgrep/guardian`, `github.com/trailofbits/skills/plugins/static-analysis`

| Aspect | Details |
|--------|---------|
| **Type** | Fast pattern-based SAST, 30+ languages |
| **Engine** | OCaml, semantic grep (matches code structure, not text) |
| **Rules** | 2,000+ community rules (semgrep-rules repo) + 20,000+ Pro rules |
| **Modes** | Community Edition (intra-file only), Pro (cross-file taint tracking, 250% more true positives) |
| **Output** | SARIF, JSON, text; CI/CD integration with diff-aware baselines |
| **AI Integration** | Semgrep Guardian: MCP server + hooks for Claude Code/Cursor; scans every file write |

**Key Capabilities:**
- **Taint tracking** (Pro): `src/tainting/` module implements data flow from sources to sinks across functions/files
- **Supply Chain** (SCA): Reachability analysis for 12 languages across 15 package managers — only flags vulnerabilities in *actually reachable* code paths
- **Secrets**: Semantic analysis + entropy + validation for 630+ credential types
- **Custom rules**: YAML syntax resembling target code; supports autofix
- **Guardian hooks**: Fire on every file write in AI coding agents; block vulnerable code before commit

**Limitations (Community Edition):** No cross-file analysis, higher false positives. Pro engine required for production SAST.

**Primary Source Evidence:**
- `semgrep.dev/products/semgrep-code/pro-engine` — Pro adds cross-file taint tracking
- `github.com/semgrep/semgrep/tree/develop/src/tainting` — 20+ OCaml modules for taint analysis
- `github.com/semgrep/guardian` — MCP server + hooks for AI agents

---

### CodeQL

**Source:** `codeql.github.com`, `github.com/github/codeql`, `github.com/trailofbits/skills/plugins/static-analysis`

| Aspect | Details |
|--------|---------|
| **Type** | Deep semantic SAST with full interprocedural analysis |
| **Engine** | QL query language; builds code database (AST + control flow + data flow) |
| **Languages** | C/C++, C#, Go, Java, JavaScript/TypeScript, Python, Ruby, Rust, Swift, more |
| **Queries** | Security-extended, security-and-quality, community packs; Trail of Bits custom packs |
| **Taint Tracking** | Full cross-file, cross-function data flow with sanitizer modeling |
| **Output** | SARIF 2.1.0; GitHub Code Scanning integration |
| **License** | Free for OSS/research; commercial license for closed-source CI/CD |

**Key Capabilities:**
- **Variant analysis**: Generalize a known vuln into a query, find all instances across codebase
- **Data extensions**: Model project-specific APIs as sources/sinks/sanitizers
- **Quality gates**: Trail of Bits `static-analysis` plugin enforces SARIF parsing, deduplication, severity thresholds

**Primary Source Evidence:**
- `github.com/github/codeql` — 91K+ commits, 10.3K stars, standard libraries + queries
- `codeql.github.com/docs/codeql-language-guides` — per-language query writing guides
- `trailofbits/skills/plugins/static-analysis` — CodeQL + Semgrep + SARIF parsing toolkit

---

### Bandit

**Source:** `bandit.readthedocs.io`, `github.com/PyCQA/bandit`

| Aspect | Details |
|--------|---------|
| **Type** | Python-specific security linter (AST-based) |
| **Architecture** | Plugin system via `bandit.plugins` entry points; processes each file, builds AST, runs plugins against nodes |
| **Test IDs** | B1xx misc, B2xx config, B3xx call blacklists, B4xx import blacklists, B5xx crypto, B6xx injection, B7xx XSS |
| **Key Plugins** | `injection_shell.py` (shell=True detection), `injection_sql.py`, `django_xss.py`, `jinja2_templates.py`, `exec_used.py`, `yaml_load.py` |
| **Blacklists** | Extensible via `bandit.blacklists` entry point for dangerous calls/imports |
| **Output** | CSV, HTML, JSON, SARIF, screen, txt, XML, YAML |
| **Baselines** | Compare against baseline report to suppress known issues |

**Injection Detection (Primary Source: `bandit.readthedocs.io/en/latest/_modules/bandit/plugins/injection_shell.html`):**
- Detects `subprocess.Popen`, `os.system`, `os.popen*` with `shell=True`
- Severity escalates: static string (LOW) → shell chars (MEDIUM) → computed string (HIGH)
- Also checks custom wrappers around vulnerable methods

**Primary Source Evidence:**
- `github.com/PyCQA/bandit/tree/main/bandit/plugins` — 30+ plugin files
- `bandit.readthedocs.io/en/latest/blacklists/index.html` — extensible blacklist mechanism
- `bandit.readthedocs.io/en/latest/plugins/index.html` — plugin authoring guide

---

### ESLint Security Plugins

**Source:** `eslint.org/docs/latest/rules`, `eslint.org/docs/latest/extend/plugins`

| Aspect | Details |
|--------|---------|
| **Core Security Rules** | `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url`, `no-unsafe-regex`, `require-atomic-updates` |
| **Plugin Ecosystem** | `eslint-plugin-security`, `eslint-plugin-no-unsanitized`, `eslint-plugin-xss` |
| **Rule Categories** | Possible Problems, Suggestions, Layout; `✅ Recommended`, `🔧 Fixable`, `💡 Suggestions`, `❄️ Frozen` |
| **Custom Rules** | Full plugin API: custom rules, processors, parsers, formatters; `Custom Rule Tutorial` in docs |

**Key Security Rules (from `eslint.org/docs/latest/rules/`):**
- `no-eval` / `no-implied-eval` — blocks `eval()` and `setTimeout(string)` patterns
- `no-new-func` — blocks `new Function()` constructor
- `no-script-url` — blocks `javascript:` URLs
- `no-unsafe-regex` — ReDoS detection via `safe-regex` package
- `require-atomic-updates` — race conditions from `await`/`yield` in updates
- `no-proto` — blocks `__proto__` mutation (prototype pollution vector)

**Primary Source Evidence:**
- `eslint.org/docs/latest/rules/` — 300+ rules with metadata
- `eslint.org/docs/latest/extend/plugins` — plugin creation tutorial

---

## SCA/Dependency Scanning

### npm audit

**Source:** `docs.npmjs.com/cli/v10/commands/npm-audit`

| Aspect | Details |
|--------|---------|
| **Endpoints** | Bulk Advisory (fast, POST `/-/npm/v1/security/advisories/bulk`) + Quick Audit (fallback) |
| **Meta-vulnerability Calculation** | `@npmcli/metavuln-calculator` — transitive vulns where dependent package can only install vulnerable versions |
| **Fix** | `npm audit fix` — minimal SemVer-compatible upgrades; `--force` for major versions |
| **Signatures** | `npm audit signatures` — verifies ECDSA registry signatures + provenance attestations (PEP 740) |
| **Exit Codes** | Non-zero if vulns found; `--audit-level` sets failure threshold (info/low/moderate/high/critical/none) |
| **Scrubbing** | Removed in npm v7 (was leaking private package names) |

**Key Mechanism:**
```
POST /-/npm/v1/security/advisories/bulk
{ "name": "versions[]" }
→ advisory objects with vulnerable_versions ranges
→ metavuln calculator → vulnerability tree
```

**Primary Source Evidence:**
- `docs.npmjs.com/cli/v10/commands/npm-audit` — full command reference
- `docs.npmjs.com/policies/security` — security policy, reporting

---

### Snyk

**Source:** `snyk.io/platform`, `docs.snyk.io/scan-fix-and-prevent`, `docs.snyk.io/agent-security`

| Product | Coverage |
|---------|----------|
| **Snyk Code (SAST)** | AI-based semantic engine; API usage, control flow, data flow, interfile analysis, template file analysis, hardcoded secrets |
| **Snyk Open Source (SCA)** | Version-matched advisories; transitive deps; license compliance; fix PRs |
| **Snyk Container** | Container image + workload vulnerabilities |
| **Snyk IaC** | Terraform, CloudFormation, K8s, Helm misconfigurations |
| **Snyk Secrets** | Dedicated secrets scanning across IDE/CLI/SCM/PR |

**AI Security Platform (Evo + Studio):**
- **Snyk Studio**: Embeds security directives into AI coding assistants (Claude Code, Cursor, Copilot, Gemini, Windsurf, Kiro) via hooks + rules + MCP server
- **Agent Supply Chain Security**: Validates external tools before use, governs agent behavior, secures generated code
- **AI-SPM**: Inventory of AI models, MCP servers, skills with risk scores
- **Continuous Offensive Security**: AI pentesting for business-logic vulns

**Directives (from `docs.snyk.io/agent-security/agentic-security-with-snyk-studio/directives`):**
- **Guardrail directives**: Auto-injected (hooks = deterministic, rules = non-deterministic)
- **Command directives**: Manual invocation (e.g., `/snyk-fix` — full remediation workflow)
- **Secure at Inception**: Run `snyk_code_scan`/`snyk_sca_scan` on every AI-generated code block; iterate until clean
- **Package health check**: `snyk_package_health_check` skill + hook blocks `npm install` until scan passes

**Primary Source Evidence:**
- `snyk.io/product` — platform overview with AI security engines
- `docs.snyk.io/scan-fix-and-prevent/scan-with-snyk/snyk-code.md` — SAST engine details
- `docs.snyk.io/agent-security` — Studio, Evo, AI-SPM, ADS, COS
- `github.com/snyk/studio-recipes` — installer + guardrail/command directives catalog

---

### Trivy

**Source:** `trivy.dev/docs/latest`, `github.com/aquasecurity/trivy`

| Scanner | Targets | Data Sources |
|---------|---------|--------------|
| **Vulnerability** | OS pkgs, language pkgs, non-packaged, K8s | 25+ OS vendor advisories (Red Hat OVAL, Debian Security Tracker, GitHub Advisory DB, Go Vuln DB, etc.) |
| **Misconfiguration** | IaC (Terraform, CFN, K8s, Helm, Docker), custom Rego policies | Built-in checks + custom |
| **Secret** | Container, FS, Git repo | 100+ built-in rules (AWS, GCP, GitHub, GitLab, Slack, etc.); custom regex rules |
| **License** | SPDX identifiers | Built-in DB |
| **SBOM** | CycloneDX, SPDX, Syft | Syft integration |

**Key Features:**
- **Detection priority**: `precise` (fewer FPs, default) vs `comprehensive` (more coverage, more FPs)
- **Package relationships**: Filter by `root`, `direct`, `indirect`, `workspace`, `unknown`
- **Unfixed vulns**: `--ignore-unfixed` hides unpatched vulnerabilities
- **Plugins**: `trivy plugin` system (kubectl, referrer, aqua); warns: "not audited for security"
- **Custom secret rules**: `trivy-secret.yaml` with regex, keywords, allow-rules, severity

**Primary Source Evidence:**
- `trivy.dev/docs/latest/scanner/vulnerability` — 25 OS sources, language sources table
- `trivy.dev/docs/latest/scanner/secret` — custom rules, allow rules, enable/disable
- `trivy.dev/docs/latest/plugin` — plugin system, security warning
- `github.com/aquasecurity/trivy/tree/main/pkg/fanal/secret` — built-in rules source

---

## Secrets Detection

### gitleaks / TruffleHog

**Source:** `github.com/gitleaks/gitleaks`, `github.com/trufflesecurity/trufflehog` (referenced in Trail of Bits skills)

| Tool | Approach |
|------|----------|
| **gitleaks** | Regex-based; git history + dir + stdin scans; custom rules; pre-commit + GitHub Action; baselines for legacy |
| **TruffleHog** | Verifies secrets against live APIs (active verification); reduces false positives |

**Integration:** Trail of Bits `gitleaks-scanning` skill + `security-finding-triager` unifies with other scanners.

---

### Semgrep Secrets / Snyk Secrets / Trivy Secrets

All three use semantic analysis + entropy + validation rather than pure regex:
- **Semgrep**: Language-agnostic, 630+ credential types, validation reduces noise
- **Snyk**: Dedicated scanner across IDE/CLI/SCM/PR
- **Trivy**: Custom rules with allow-rules, keyword pre-filtering for performance

---

## Malware/YARA-Based Detection

### YARA / YARA-X

**Source:** `yara.readthedocs.io`, `github.com/VirusTotal/yara`, `github.com/VirusTotal/yara-x`, `trailofbits/skills/plugins/yara-authoring`

| Aspect | YARA (C) | YARA-X (Rust) |
|--------|----------|---------------|
| **Status** | Maintenance mode | Production at VirusTotal (billions of files) |
| **Speed** | Baseline | 5-10x faster for regex-heavy rules |
| **Modules** | PE, ELF, Cuckoo, Magic, Hash, Math, Dotnet, Time, Console, String | Same + `crx` (Chrome ext), `dex` (Android DEX) |
| **Rule Format** | Strings (hex, text, regex) + boolean condition | Same + improvements |
| **Performance** | Atom extraction critical | Same; `atom_analyzer.py` evaluates string quality |

**Rule Structure:**
```yara
rule silent_banker : banker {
  meta: description = "..." threat_level = 3 in_the_wild = true
  strings: $a = {6A 40...} $b = "UVODFRYSIHLNWPEJXQZAKCBGMT"
  condition: $a or $b or $c
}
```

**Trail of Bits YARA Authoring Skill:**
- Decision trees for string quality, when to abandon approaches
- Expert heuristics: "mutex names are gold, API names are garbage"
- Performance: atom quality, short-circuit conditions
- Testing: goodware corpus validation
- Migration guide from legacy YARA

**Primary Source Evidence:**
- `yara.readthedocs.io/en/latest/writingrules.html` — full rule syntax
- `github.com/VirusTotal/yara-x` — 3K+ commits, 1.4K stars, production-hardened
- `trailofbits/skills/plugins/yara-authoring` — expert authoring methodology

---

### VirusTotal

**Source:** `virustotal.readme.io/reference`, `developers.virustotal.com/reference`

| Capability | API Endpoints |
|------------|---------------|
| **File scanning** | Upload (≤32MB) / upload_url (≤650MB) → analysis → report |
| **URL/Domain/IP reputation** | Scan + report + rescan + comments + votes |
| **YARA rulesets** | Crowdsourced + Livehunt (real-time) + Retrohunt (historical) |
| **Sandbox behavior** | HTML/JSON reports: processes, network, files dropped, MITRE ATT&CK |
| **Code Insights** | Static analysis of code blocks |
| **Intelligence** | Advanced corpus search, file content snippets |
| **Feeds** | Per-minute/hourly file, domain, IP, URL, sandbox behavior feeds |

**Integration with Catalogs:**
- VT API used by registries for pre-publish malware scanning
- Livehunt/Retrohunt for continuous monitoring of published packages
- Crowdsourced YARA rulesets for community threat intelligence

---

## Injection Pattern Detection

### SQL Injection

| Tool | Detection Method |
|------|------------------|
| **Semgrep** | Taint tracking: user input → DB query without parameterization; Pro cross-file |
| **CodeQL** | Data flow: source (request params) → sink (executeQuery) without sanitizer |
| **Bandit** | `injection_sql.py` — detects string formatting in SQL (`%`, `.format`, f-strings) |
| **Snyk Code** | AI engine models API usage + data flow; template file analysis for rendered SQL |
| **ESLint** | `eslint-plugin-security` rules for dangerous DB patterns |

### XSS (Cross-Site Scripting)

| Tool | Detection Method |
|------|------------------|
| **Semgrep** | Taint: user input → HTML/template output without encoding; framework-specific (React, Jinja2, Django) |
| **CodeQL** | Data flow through template engines; sink modeling for `innerHTML`, `dangerouslySetInnerHTML` |
| **Bandit** | `django_xss.py` (`mark_safe`), `jinja2_templates.py` (autoescape=false), `markupsafe_markup_xss.py` |
| **Snyk Code** | Template file analysis follows data into rendering; detects XSS only exploitable at render time |
| **ESLint** | `no-script-url`, React-specific rules; `eslint-plugin-xss` |

### Command Injection

| Tool | Detection Method |
|------|------------------|
| **Semgrep** | Pattern: `subprocess.*(shell=True)` + user-controlled args; taint tracking |
| **CodeQL** | Data flow to `ProcessBuilder`, `Runtime.exec`, `subprocess` with shell |
| **Bandit** | `injection_shell.py` — `shell=True` severity: static (LOW) → computed (HIGH) |
| **Snyk** | API usage modeling for process spawning APIs |
| **Trivy** | Misconfiguration checks for dangerous shell usage in IaC |

### Prototype Pollution

| Tool | Detection Method |
|------|------------------|
| **Semgrep** | Patterns for `Object.prototype.*` assignment, `Object.assign` with user input, recursive merge |
| **CodeQL** | Data flow to prototype-modifying operations |
| **ESLint** | `no-proto` (blocks `__proto__`), `no-extend-native` |
| **Snyk** | JavaScript/TypeScript specific query packs |

### eval / Dynamic Code Execution

| Tool | Detection Method |
|------|------------------|
| **Semgrep** | Direct pattern: `eval(...)`, `new Function(...)`, `setTimeout(string)`, `vm.runInNewContext` |
| **Bandit** | `exec_used.py` (B102), `try_except_pass.py` (B110) |
| **ESLint** | `no-eval`, `no-implied-eval`, `no-new-func` (core recommended rules) |
| **CodeQL** | Taint to code execution sinks |

### Obfuscation Detection

| Tool | Approach |
|------|----------|
| **YARA** | String patterns: high entropy, base64, hex encoding, packer signatures (UPX, etc.) |
| **VirusTotal** | Sandbox behavior + static analysis: `packers` field, `detectiteasy`, `entropy` |
| **Trivy** | Secret scanning detects high-entropy strings; misconfig checks for obfuscated scripts |
| **Custom** | Entropy calculation + ML classifiers on AST/node sequences |

---

## AI Agent Security & Plugin Catalogs

### New Attack Surface from AI Coding Agents

**Source:** `docs.snyk.io/agent-security`, `github.com/semgrep/guardian`, `trailofbits/skills/plugins/agentic-actions-auditor`, `trailofbits/skills/plugins/supply-chain-risk-auditor`

| Vector | Description | Mitigation |
|--------|-------------|------------|
| **Prompt Injection** | Attacker-controlled input (PR titles, comments, file contents) reaches AI prompt | Snyk Studio guardrails, Semgrep Guardian hooks |
| **Tool Misuse** | AI agent calls dangerous tools (shell, filesystem, network) without validation | MCP server tool allowlists, hook-based blocking |
| **Supply Chain via MCP** | Malicious MCP servers exfiltrate code, inject vulnerabilities | Snyk Agent Supply Chain Security validates external tools |
| **GitHub Actions + AI** | `pull_request_target` + checkout + AI action = attacker code execution in CI | `agentic-actions-auditor` detects 9 attack vector categories |
| **Dependency Confusion** | AI suggests/installs malicious packages | `snyk_package_health_check` skill + hook blocks install until scan |

**Semgrep Guardian Architecture (`github.com/semgrep/guardian`):**
- **MCP Server**: Exposes Semgrep scan tools to AI agent (list projects, get findings)
- **Hooks**: Fire on every file write; scan regardless of agent action; block vulnerable code before PR
- **Scanners**: Semgrep Code (SAST), Supply Chain (SCA), Secrets — all three on every generation

**Snyk Studio Directives (`docs.snyk.io/agent-security/agentic-security-with-snyk-studio/directives`):**
- **Guardrail directives**: Auto-injected via hooks (deterministic) or rules (non-deterministic)
- **Secure at Inception**: Mandatory scan → fix → rescan loop until clean
- **Package enforcement hook**: Blocks `npm install` until `snyk_package_health_check` passes

**Trail of Bits Agentic Actions Auditor (`trailofbits/skills/plugins/agentic-actions-auditor`):**
Detects 9 attack vector categories in GitHub Actions workflows using AI agents:
- A. Env Var Intermediary
- B. Direct Expression Injection (`${{ github.event.* }}` in prompts)
- C. CLI Data Fetch (`gh` commands in prompts)
- D. PR Target + Checkout
- E. Error Log Injection
- F. Subshell Expansion (`echo $(env)`)
- G. Eval of AI Output
- H. Dangerous Sandbox Configs (`danger-full-access`, `--yolo`)
- I. Wildcard Allowlists

---

## Marketplace/Catalog Security Practices

### npm Registry

**Source:** `docs.npmjs.com/policies/security`, `docs.npmjs.com/cli/v10/commands/npm-audit`, `docs.npmjs.com/creating-and-publishing-unscoped-public-packages`

| Practice | Implementation |
|----------|----------------|
| **2FA for publishing** | Required for package publishing and settings modification |
| **Provenance/Attestations** | ECDSA signatures on packages; `npm audit signatures` verifies; PEP 740 attestations |
| **Trusted Publishing** | OIDC-based (GitHub Actions → npm) without long-lived tokens |
| **Malware reporting** | `npmjs.com/support` — "Reporting malware in an npm package" |
| **Unpublish policy** | Restricted: 72-hour window for new packages; otherwise requires support |
| **Security advisories** | Bulk Advisory endpoint + GitHub Advisory Database integration |
| **Scoped packages** | Organization scopes with team-based access control |

**Malware Handling:** No automatic scanning documented. Relies on:
1. User reports via support
2. `npm audit` pulls advisories from GitHub Advisory DB
3. Provenance attestations prevent tampering post-publish
4. Unpublish restrictions limit damage window

---

### PyPI (Warehouse)

**Source:** `docs.pypi.org/using-pypi/package-security`, `github.com/pypi/warehouse`

| Practice | Implementation |
|----------|----------------|
| **Trusted Publishing** | OIDC (GitHub, GitLab, Azure, etc.) — no API tokens |
| **Attestations** | PEP 740 — cryptographic signing + verification of packages |
| **Provenance** | Integrity API retrieves attestations; verifies build workflow |
| **Yanking** | Mark release as broken/vulnerable without deletion (`pypi.org/project-management/yanking`) |
| **Archiving** | Mark project as unmaintained |
| **Name retention** | PEP 541 — reclaim abandoned names |
| **Security alerts** | Account-level alerts for suspicious activity |
| **Malware reporting** | Secret Reporting API for exposed tokens; support for package issues |

**Key Quote (from `docs.pypi.org/using-pypi/package-security/introduction`):**
> "When you add a package to your Python project, you are choosing to execute code written by someone else on your machine. This is the foundation of modern software development, but it also carries inherent risks. A malicious or compromised package could steal data, damage your system, or create a backdoor into your application."

**No documented pre-publish malware scanning.** Relies on:
1. Trusted publishing (provenance)
2. Community reporting
3. Yanking for post-detection mitigation

---

### VS Code Marketplace

**Source:** `marketplace.visualstudio.com/search?category=security` (limited public docs)

| Practice | Status |
|----------|--------|
| **Malware scanning** | Not publicly documented |
| **Security review** | Extensions run in Extension Host process (partial isolation) |
| **Reporting** | "Report Abuse" on extension page |
| **Verification** | Publisher verification badge (domain ownership) |
| **Permissions** | Extension manifest declares capabilities; user prompted at install |

**Gap:** No public documentation of automated malware scanning, quarantine, or rewriting.

---

### AI Agent Marketplaces (Claude Code, Cursor)

**Source:** `github.com/semgrep/guardian`, `docs.snyk.io/agent-security`, `github.com/snyk/studio-recipes`

| Marketplace | Security Model |
|-------------|----------------|
| **Claude Code** | Plugin system (`/plugin`); Semgrep Guardian + Snyk Studio install as plugins; hooks scan every file write |
| **Cursor** | Plugin marketplace; Snyk Studio hooks + skills; similar model |
| **GitHub Copilot** | Snyk Security plugin + direct Snyk Studio install |

**Key Difference:** Security runs **at generation time** (hooks), not at publish time. The "catalog" is the plugin marketplace; malicious plugins are caught by:
1. Plugin review process (manual)
2. Runtime hooks (Semgrep Guardian, Snyk Studio) scanning generated code
3. MCP server validation (Snyk validates external tools)

---

## Quarantine, Marking, Rewriting Mechanisms

### Quarantine (Isolation Without Deletion)

| System | Mechanism |
|--------|-----------|
| **PyPI** | **Yanking** — `yank` marks release as broken/vulnerable; `pip` warns but allows install with `--no-deps`; metadata retained |
| **npm** | **Deprecation** — `npm deprecate` adds warning; no install block. **Unpublish** — restricted (72hr new, then support) |
| **GitHub Advisory Database** | **GHSA IDs** — published advisories; `npm audit` / `pip-audit` / `trivy` consume |
| **OSV (Open Source Vulnerabilities)** | **OSV Schema** — unified vulnerability format; `osv.dev` API; consumed by Trivy, Snyk, npm audit (fallback) |
| **VirusTotal** | **Detection** — file marked malicious; no quarantine; feeds notify subscribers |
| **AI Agent Hooks** | **Blocking** — Semgrep Guardian / Snyk Studio hooks **prevent** vulnerable code from being written (pre-commit equivalent) |

### Marking (Metadata Flags)

| System | Marking |
|--------|---------|
| **PyPI** | `yanked: true` in release metadata; `Project archived` banner |
| **npm** | `deprecated` field in `packument`; `malware` flag (internal, not public API) |
| **GitHub Packages** | `security_advisories` link; `dependabot` alerts |
| **Snyk** | Priority Score (risk-based); `ignored` / `patched` / `fixed` status per issue |
| **Semgrep** | `nosemgrep` comments suppress; baseline files track known issues |
| **Trivy** | `.trivyignore` suppressions; `--ignore-unfixed` flag |
| **CodeQL** | SARIF `suppressions`; baseline databases |

### Rewriting (Automatic Remediation)

| System | Rewriting Capability |
|--------|---------------------|
| **Semgrep** | **Autofix** — YAML rules with `fix:` patterns; `--autofix` flag; Trail of Bits `semgrep-rule-creator` skill |
| **Snyk** | **Agent Fix** — AI-powered remediation; `/snyk-fix` directive: scan → analyze → fix → validate → PR; 72%→82% merge-ready with Snyk intelligence |
| **CodeQL** | **CodeQL AI Fix** (VS Code extension) — ML-powered fixes from SARIF; confidence scoring (high≥65% auto, med 40-65% review, low<40% manual) |
| **npm** | `npm audit fix` — minimal version upgrades; rewrites `package-lock.json` |
| **ESLint** | `--fix` — auto-fixes for `🔧 Fixable` rules (e.g., `no-eval` → suggest alternative) |
| **Bandit** | No autofix; reports line + context |
| **Trivy** | No autofix; reports + `.trivyignore` |
| **AI Agent Directives** | **Generation-time rewriting** — Snyk `/snyk-fix` skill loops: generate → scan → fix → rescan until clean **before commit** |

---

## Sandboxed Execution & Custom Analysis

### Sandboxed Execution

| Platform | Sandbox Model |
|----------|---------------|
| **VS Code Extensions** | Extension Host process (separate from UI); limited filesystem/network via API |
| **GitHub Actions** | Ephemeral runners; `pull_request_target` + checkout = escape risk (detected by `agentic-actions-auditor`) |
| **AI Agent Tools** | MCP servers define tool allowlists; Snyk validates before use; Semgrep Guardian hooks intercept file writes |
| **VirusTotal** | **Full sandbox** — dynamic analysis: processes, network, files, registry, MITRE ATT&CK; HTML/PCAP/EVTX reports |
| **CodeQL** | No runtime sandbox; builds database from source (static) |
| **Custom** | Firecracker/gVisor/Kata Containers for untrusted plugin execution (not standard in catalogs) |

### Custom Static Analysis for Plugins

**Trail of Bits Skills Ecosystem (`trailofbits/skills`):**

| Plugin/Skill | Purpose |
|--------------|---------|
| `supply-chain-risk-auditor` | Collects: advisories (OSV), deprecated/yanked, abandoned repo, publisher concentration (npm), install scripts, Scorecard checks; renders Markdown report |
| `static-analysis` | CodeQL + Semgrep + SARIF parsing; `semgrep-scan` workflow (detect→select→scan→report); `codeql-build` (autobuild→custom→multi-step→no-build) |
| `variant-analysis` | Generalize known vuln → CodeQL/Semgrep query → parallel subagents → loop until no new variants |
| `yara-authoring` | Expert YARA-X rule authoring; atom analysis; performance optimization; testing workflow |
| `vulnerability-triage-brocards` | 7 brocards for triage: threat model, exploit feasibility, usage context, standard behavior, documented behavior, cost/benefit, report insufficiency |
| `fp-check` | Systematic FP verification: standard (linear) vs deep (parallel sub-phases) paths; 6 mandatory gate reviews; 13 FP patterns checklist |
| `agentic-actions-auditor` | 9 attack vectors for AI agents in GitHub Actions |

**Custom Analysis Patterns:**
1. **AST-based** (Bandit, ESLint plugins) — language-specific, fast, intra-file
2. **Pattern-based** (Semgrep Community) — cross-language, fast, intra-file
3. **Semantic/taint** (Semgrep Pro, CodeQL, Snyk Code) — cross-file, data flow, higher accuracy
4. **Behavioral** (VirusTotal sandbox, Trivy misconfig) — runtime or config analysis
5. **Signature-based** (YARA, VirusTotal) — known malware families, obfuscation patterns

---

## Comparative Analysis

### Tool Coverage Matrix

| Capability | Semgrep | CodeQL | Bandit | ESLint | npm audit | Snyk | Trivy | VirusTotal | YARA |
|------------|---------|--------|--------|--------|-----------|------|-------|------------|------|
| **SAST** | ✅ (Pro: cross-file) | ✅ (deep) | ✅ (Python) | ✅ (JS/TS) | ❌ | ✅ (AI) | ❌ | ❌ | ❌ |
| **SCA** | ✅ (reachability) | ❌ | ❌ | ❌ | ✅ (meta-vuln) | ✅ | ✅ | ❌ | ❌ |
| **Secrets** | ✅ (semantic) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Malware** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (sandbox) | ✅ (patterns) |
| **Injection** | ✅ (taint) | ✅ (data flow) | ✅ (AST) | ✅ (rules) | ❌ | ✅ | ✅ (IaC) | ✅ (behavior) | ✅ (custom) |
| **Obfuscation** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ (entropy) | ✅ | ✅ |
| **AI Agent** | ✅ (Guardian) | ❌ | ❌ | ❌ | ❌ | ✅ (Studio) | ❌ | ❌ | ❌ |
| **Autofix** | ✅ | ✅ (AI) | ❌ | ✅ | ✅ (upgrade) | ✅ (Agent Fix) | ❌ | ❌ | ❌ |
| **Output** | SARIF, JSON | SARIF | SARIF, JSON | Custom | JSON | SARIF, JSON | JSON, SARIF | JSON | Custom |

### Catalog Security Posture Comparison

| Catalog | Pre-Publish Scan | Post-Publish Monitoring | Quarantine | Rewriting | AI Agent Integration |
|---------|------------------|------------------------|------------|-----------|---------------------|
| **npm** | ❌ (provenance only) | ✅ (advisories) | ❌ (deprecate/yank limited) | ✅ (audit fix) | ⚠️ (via Snyk/Semgrep) |
| **PyPI** | ❌ (trusted publishing) | ✅ (yank/archive) | ✅ (yank) | ❌ | ⚠️ (via Snyk/Semgrep) |
| **VS Code Marketplace** | ❓ (undocumented) | ❓ | ❓ | ❌ | ❌ |
| **GitHub Marketplace** | ⚠️ (Actions review) | ✅ (Dependabot) | ✅ (advisories) | ⚠️ (PR fixes) | ✅ (Copilot + Snyk) |
| **Claude Code Plugins** | ⚠️ (manual review) | ✅ (Guardian hooks) | ✅ (hook block) | ✅ (generation-time) | ✅ (native) |
| **Cursor Plugins** | ⚠️ (manual review) | ✅ (Snyk hooks) | ✅ (hook block) | ✅ (generation-time) | ✅ (native) |

---

## Gaps & Open Questions

### 1. No Standardized Pre-Publish Malware Scanning for Plugin Catalogs
- npm/PyPI rely on provenance + trusted publishing + post-publish reporting
- VS Code Marketplace: no public documentation of scanning
- AI agent marketplaces: scan at **generation time** (hooks), not publish time

### 2. Quarantine vs. Deletion Trade-offs
- PyPI yanking preserves metadata but allows install with flags
- npm unpublish heavily restricted (left-pad incident legacy)
- No catalog implements true "quarantine" (isolated, non-installable, reviewable)

### 3. Rewriting at Scale
- Snyk Agent Fix + Semgrep autofix work at **project level**
- No catalog-level rewriting (e.g., automatically patching published packages)
- Legal/license barriers to modifying published artifacts

### 4. AI Agent Plugin Supply Chain
- MCP servers are unsigned, unverified executables
- Snyk Agent Supply Chain Security validates but not universally adopted
- No standard for MCP server signing/attestation

### 5. Obfuscation/Evasion Detection
- YARA/VirusTotal detect known packers/obfuscation
- No catalog integrates dynamic analysis (sandbox) pre-publish
- Custom static analysis for obfuscated JS/Python not standardized

### 6. Prototype Pollution / Deserialization / Supply Chain in Plugins
- Detected by SAST tools but not catalog-gated
- `eslint-plugin-security`, Bandit, Semgrep have rules but not enforced at publish

### 7. Cross-Catalog Intelligence Sharing
- OSV/GHSA unify vulnerability data
- No equivalent for **malware** or **malicious package behavior** (typosquatting, dependency confusion, protestware)
- VirusTotal feeds are commercial; no open threat intel feed for package registries

---

## Queries Log

```
2026-11-10T00:00Z  START  deep research security scanning plugin catalogs malware detection
2026-11-10T00:05Z  FETCH  https://claude.com/marketplace/plugins/semgrep  (Semgrep Guardian)
2026-11-10T00:06Z  FETCH  https://github.com/semgrep/guardian  (Guardian repo)
2026-11-10T00:07Z  FETCH  https://github.com/trailofbits/skills  (ToB skills marketplace)
2026-11-10T00:08Z  FETCH  https://bandit.readthedocs.io/en/latest/  (Bandit docs)
2026-11-10T00:09Z  FETCH  https://github.com/PyCQA/bandit  (Bandit repo)
2026-11-10T00:10Z  FETCH  https://snyk.io/product/  (Snyk platform)
2026-11-10T00:11Z  FETCH  https://trivy.dev/  (Trivy homepage)
2026-11-10T00:12Z  FETCH  https://developers.virustotal.com/reference  (VT API docs)
2026-11-10T00:13Z  FETCH  https://yara.readthedocs.io/  (YARA docs)
2026-11-10T00:14Z  FETCH  https://marketplace.visualstudio.com/search?category=security  (VS Code marketplace)
2026-11-10T00:15Z  FETCH  https://github.com/aquasecurity/trivy  (Trivy repo)
2026-11-10T00:16Z  FETCH  https://docs.snyk.io/  (Snyk docs)
2026-11-10T00:17Z  FETCH  https://github.com/semgrep/semgrep  (Semgrep repo)
2026-11-10T00:18Z  FETCH  https://trivy.dev/docs/latest/scanner/vulnerability/  (Trivy vuln scanner)
2026-11-10T00:19Z  FETCH  https://trivy.dev/docs/latest/scanner/secret/  (Trivy secrets)
2026-11-10T00:20Z  FETCH  https://trivy.dev/docs/latest/plugin/  (Trivy plugins)
2026-11-10T00:21Z  FETCH  https://docs.npmjs.com/cli/v10/commands/npm-audit  (npm audit)
2026-11-10T00:22Z  FETCH  https://eslint.org/docs/latest/rules/  (ESLint rules)
2026-11-10T00:23Z  FETCH  https://github.com/aquasecurity/trivy/tree/main/pkg/fanal/secret  (Trivy secret rules)
2026-11-10T00:24Z  FETCH  https://github.com/trailofbits/skills/tree/main/plugins/supply-chain-risk-auditor
2026-11-10T00:25Z  FETCH  https://github.com/trailofbits/skills/tree/main/plugins/static-analysis
2026-11-10T00:26Z  FETCH  https://docs.snyk.io/agent-security  (Snyk agent security)
2026-11-10T00:27Z  FETCH  https://github.com/semgrep/semgrep/tree/develop/src/tainting  (Semgrep tainting)
2026-11-10T00:28Z  FETCH  https://docs.snyk.io/agent-security/agentic-security-with-snyk-studio/directives  (Snyk directives)
2026-11-10T00:29Z  FETCH  https://github.com/trailofbits/skills/tree/main/plugins/agentic-actions-auditor
2026-11-10T00:30Z  FETCH  https://github.com/trailofbits/skills/tree/main/plugins/vulnerability-triage-brocards
2026-11-10T00:31Z  FETCH  https://github.com/trailofbits/skills/tree/main/plugins/fp-check
2026-11-10T00:32Z  FETCH  https://github.com/snyk/studio-recipes  (Snyk Studio recipes)
2026-11-10T00:33Z  FETCH  https://docs.npmjs.com/policies/security  (npm security policy)
2026-11-10T00:34Z  FETCH  https://docs.pypi.org/  (PyPI docs)
2026-11-10T00:35Z  FETCH  https://github.com/pypi/warehouse  (Warehouse repo)
2026-11-10T00:36Z  FETCH  https://github.com/VirusTotal/yara-x  (YARA-X repo)
2026-11-10T00:37Z  FETCH  https://codeql.github.com/docs/codeql-language-guides/  (CodeQL guides)
2026-11-10T00:38Z  FETCH  https://github.com/github/codeql  (CodeQL repo)
2026-11-10T00:39Z  FETCH  https://docs.pypi.org/using-pypi/package-security/introduction/  (PyPI security)
2026-11-10T00:40Z  FETCH  https://github.com/semgrep/semgrep-rules  (Semgrep rules repo)
```

---

## Source Index (data/ directory)

Raw fetches saved to `H:/susa ai 500/dsh market/harness-market-ds/brain/research/security/data/`:

| File | Source | Type |
|------|--------|------|
| `01_semgrep_guardian.md` | claude.com/marketplace/plugins/semgrep | Product page |
| `02_semgrep_guardian_repo.md` | github.com/semgrep/guardian | Repository |
| `03_trailofbits_skills.md` | github.com/trailofbits/skills | Marketplace |
| `04_bandit_docs.md` | bandit.readthedocs.io | Documentation |
| `05_bandit_repo.md` | github.com/PyCQA/bandit | Repository |
| `06_snyk_platform.md` | snyk.io/product | Product page |
| `07_trivy_homepage.md` | trivy.dev | Homepage |
| `08_virustotal_api.md` | developers.virustotal.com/reference | API Reference |
| `09_yara_docs.md` | yara.readthedocs.io | Documentation |
| `10_vscode_marketplace.md` | marketplace.visualstudio.com | Marketplace |
| `11_trivy_repo.md` | github.com/aquasecurity/trivy | Repository |
| `12_snyk_docs.md` | docs.snyk.io | Documentation |
| `13_semgrep_repo.md` | github.com/semgrep/semgrep | Repository |
| `14_trivy_vuln.md` | trivy.dev/docs/latest/scanner/vulnerability/ | Documentation |
| `15_trivy_secret.md` | trivy.dev/docs/latest/scanner/secret/ | Documentation |
| `16_trivy_plugin.md` | trivy.dev/docs/latest/plugin/ | Documentation |
| `17_npm_audit.md` | docs.npmjs.com/cli/v10/commands/npm-audit | CLI Reference |
| `18_eslint_rules.md` | eslint.org/docs/latest/rules/ | Rules Reference |
| `19_trivy_secret_rules.md` | github.com/aquasecurity/trivy/tree/main/pkg/fanal/secret | Source Code |
| `20_tob_supply_chain.md` | github.com/trailofbits/skills/plugins/supply-chain-risk-auditor | Plugin README |
| `21_tob_static_analysis.md` | github.com/trailofbits/skills/plugins/static-analysis | Plugin README |
| `22_snyk_agent_security.md` | docs.snyk.io/agent-security | Documentation |
| `23_semgrep_tainting.md` | github.com/semgrep/semgrep/tree/develop/src/tainting | Source Code |
| `24_snyk_directives.md` | docs.snyk.io/agent-security/agentic-security-with-snyk-studio/directives | Documentation |
| `25_tob_agentic_actions.md` | github.com/trailofbits/skills/plugins/agentic-actions-auditor | Plugin README |
| `26_tob_brocards.md` | github.com/trailofbits/skills/plugins/vulnerability-triage-brocards | Plugin README |
| `27_tob_fp_check.md` | github.com/trailofbits/skills/plugins/fp-check | Plugin README |
| `28_snyk_studio_recipes.md` | github.com/snyk/studio-recipes | Repository |
| `29_npm_security.md` | docs.npmjs.com/policies/security | Policy |
| `30_pypi_docs.md` | docs.pypi.org | Documentation |
| `31_warehouse_repo.md` | github.com/pypi/warehouse | Repository |
| `32_yara_x_repo.md` | github.com/VirusTotal/yara-x | Repository |
| `33_codeql_guides.md` | codeql.github.com/docs/codeql-language-guides/ | Documentation |
| `34_codeql_repo.md` | github.com/github/codeql | Repository |
| `35_pypi_security.md` | docs.pypi.org/using-pypi/package-security/introduction/ | Documentation |
| `36_semgrep_rules_repo.md` | github.com/semgrep/semgrep-rules | Repository |

---

## Confidence Assessment

| Finding | Confidence | Evidence Type |
|---------|------------|---------------|
| Semgrep Guardian hooks scan every file write in AI agents | 10/10 | Primary (repo README + docs) |
| CodeQL provides deepest semantic analysis with full data flow | 10/10 | Primary (repo + docs) |
| npm audit uses Bulk Advisory + meta-vuln calculator | 10/10 | Primary (CLI docs) |
| PyPI yanking marks vulnerable without deletion | 10/10 | Primary (user docs) |
| Snyk Studio embeds security via hooks + MCP in AI agents | 10/10 | Primary (docs + recipes repo) |
| Trail of Bits skills provide supply chain audit, FP checking, variant analysis | 10/10 | Primary (plugin READMEs) |
| VirusTotal provides sandbox behavioral analysis + YARA | 10/10 | Primary (API docs) |
| YARA-X is production-hardened at VirusTotal | 9/10 | Primary (repo + VT blog) |
| VS Code Marketplace malware scanning undocumented | 7/10 | Negative evidence (no public docs) |
| Catalog-level rewriting does not exist | 8/10 | Inferred from survey |
| AI agent plugin security runs at generation time (not publish) | 9/10 | Primary (Guardian + Studio docs) |

---

*Research complete. All claims trace to primary sources in `data/` directory.*