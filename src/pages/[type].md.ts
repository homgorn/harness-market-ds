import type { APIRoute } from 'astro';
import { STATIC_PAGES } from '../lib/routes.js';
export const prerender = true;
export function getStaticPaths() {
  return ['faq', 'docs', 'security', 'about', 'privacy', 'terms', 'cookies', 'blog', 'changelog'].map((t) => ({ params: { type: t } }));
}
export const GET: APIRoute = async ({ params }) => {
  const { type } = params as { type: string };
  const lines: string[] = [];
  lines.push(`# ${type} — DSH Harness Ecosystem Catalog`);
  switch (type) {
    case 'faq':
      lines.push('## Frequently asked questions');
      lines.push('- What is DSH? DeepSeek Harness is an open-source, extensible agent harness installed with `dsh`.');
      lines.push('- Install: `dsh plugin --profile web add <name>`');
      lines.push('- Safety: Semgrep + npm audit + YARA + upstream red lines + OSV advisories. Nothing is executed on this site.');
      lines.push('- Risk levels: high (cred+network or postinstall), medium (plaintext HTTP / literal IP), low, none.');
      lines.push('- Data: awesome-dsh-plugin.com/plugins.json merged with the DSH format-1 index.');
      lines.push('- Descriptions: EN/ZH upstream; other languages machine-translated and labelled.');
      lines.push('- Report malicious: see SECURITY.md in homgorn/harness-market-ds.');
      break;
    case 'security':
      lines.push('## Security posture');
      lines.push('- Every npm package is checked against OSV.dev advisories.');
      lines.push('- Capability red lines inherited from the upstream registry: credentials+network (778), postinstall (29), plaintext HTTP, literal-IP egress.');
      lines.push('- Own CI scan: Semgrep + npm audit + custom YARA (scripts/security-scan.mjs).');
      lines.push('- Malicious findings are marked, removed, and rewritten where feasible.');
      break;
    case 'docs':
      lines.push('## Docs');
      lines.push('1. Search: https://harness-market-ds.refertur.net/search/');
      lines.push('2. Vet: check stars, downloads, license, security risk pill.');
      lines.push('3. Install: `dsh plugin --profile web add <name>`');
      lines.push('4. Keep current: compare page version with latest on npm.');
      break;
    default:
      lines.push('- See the HTML page for full content.');
  }
  lines.push('');
  lines.push('Sources: https://awesome-dsh-plugin.com/plugins.json | https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json');
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
