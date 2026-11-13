/**
 * Shared UI layer: one source of truth for the HTML shell, the header/footer
 * navigation and the plugin card. Used by:
 *   - Astro landing pages (src/pages/**)
 *   - scripts/build-plugin-pages.mjs (plugin detail shards)
 * so the two never drift.
 *
 * Plain JS on purpose: Node runs it directly, Astro imports it directly.
 */

export const SITE = 'https://harness-market-ds.refertur.net';

export const LOCALES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
];

const UI = {
  en: {
    home: 'Home', categories: 'Categories', tags: 'Tags', security: 'Security', blog: 'Blog',
    about: 'About', search: 'Search plugins…', allCategories: 'All categories', allTags: 'All tags',
    plugins: 'plugins', plugin: 'plugin', install: 'Install', homepage: 'Homepage',
    repository: 'Repository', version: 'Version', owner: 'Author', stars: 'Stars', downloads: 'Downloads',
    added: 'Added', related: 'Related plugins', capabilities: 'Capabilities', risk: 'Security risk',
    advisories: 'Known advisories', license: 'License', tagsLabel: 'Tags', page: 'Page',
    prev: 'Previous', next: 'Next', sponsored: 'Sponsored', browse: 'Browse the catalog',
    untranslated: 'Description shown in English — this page is not fully translated yet.',
    filters: 'Filters', sort: 'Sort', newest: 'Newest', popular: 'Most downloaded', top: 'Most starred',
    name: 'Name', clear: 'Clear', results: 'results', noResults: 'Nothing found',
    riskNone: 'No red lines detected', riskLow: 'Low risk', riskMedium: 'Medium risk',
    riskHigh: 'High risk', advTitle: 'Vulnerability advisories', installCmd: 'Install command',
    downloadStats: 'Downloads (30 days)', dshCompat: 'Requires DSH', jsonLd: 'SoftwareApplication',
  },
  ru: {
    home: 'Главная', categories: 'Категории', tags: 'Теги', security: 'Безопасность', blog: 'Блог',
    about: 'О проекте', search: 'Поиск плагинов…', allCategories: 'Все категории', allTags: 'Все теги',
    plugins: 'плагинов', plugin: 'плагин', install: 'Установка', homepage: 'Сайт',
    repository: 'Репозиторий', version: 'Версия', owner: 'Автор', stars: 'Звёзды', downloads: 'Скачивания',
    added: 'Добавлен', related: 'Похожие плагины', capabilities: 'Возможности', risk: 'Риск безопасности',
    advisories: 'Известные уязвимости', license: 'Лицензия', tagsLabel: 'Теги', page: 'Страница',
    prev: 'Назад', next: 'Вперёд', sponsored: 'Спонсируется', browse: 'Открыть каталог',
    untranslated: 'Описание показано на английском — страница ещё не переведена полностью.',
    filters: 'Фильтры', sort: 'Сортировка', newest: 'Новые', popular: 'По скачиваниям', top: 'По звёздам',
    name: 'Имя', clear: 'Сбросить', results: 'результатов', noResults: 'Ничего не найдено',
    riskNone: 'Красных флагов нет', riskLow: 'Низкий риск', riskMedium: 'Средний риск',
    riskHigh: 'Высокий риск', advTitle: 'Известные уязвимости', installCmd: 'Команда установки',
    downloadStats: 'Скачивания (30 дней)', dshCompat: 'Требует DSH', jsonLd: 'SoftwareApplication',
  },
  zh: {
    home: '首页', categories: '分类', tags: '标签', security: '安全', blog: '博客',
    about: '关于', search: '搜索插件…', allCategories: '全部分类', allTags: '全部标签',
    plugins: '个插件', plugin: '插件', install: '安装', homepage: '主页',
    repository: '仓库', version: '版本', owner: '作者', stars: '星标', downloads: '下载量',
    added: '添加于', related: '相关插件', capabilities: '能力', risk: '安全风险',
    advisories: '已知漏洞', license: '许可证', tagsLabel: '标签', page: '页',
    prev: '上一页', next: '下一页', sponsored: '赞助', browse: '浏览目录',
    untranslated: '描述以英文显示 — 本页面尚未完整翻译。',
    filters: '筛选', sort: '排序', newest: '最新', popular: '下载最多', top: '星标最多',
    name: '名称', clear: '清除', results: '个结果', noResults: '未找到',
    riskNone: '未发现风险标记', riskLow: '低风险', riskMedium: '中风险',
    riskHigh: '高风险', advTitle: '漏洞公告', installCmd: '安装命令',
    downloadStats: '下载量（30天）', dshCompat: '需要 DSH', jsonLd: 'SoftwareApplication',
  },
  es: {
    home: 'Inicio', categories: 'Categorías', tags: 'Etiquetas', security: 'Seguridad', blog: 'Blog',
    about: 'Acerca de', search: 'Buscar plugins…', allCategories: 'Todas las categorías', allTags: 'Todas las etiquetas',
    plugins: 'plugins', plugin: 'plugin', install: 'Instalar', homepage: 'Sitio',
    repository: 'Repositorio', version: 'Versión', owner: 'Autor', stars: 'Estrellas', downloads: 'Descargas',
    added: 'Añadido', related: 'Plugins relacionados', capabilities: 'Capacidades', risk: 'Riesgo de seguridad',
    advisories: 'Avisos conocidos', license: 'Licencia', tagsLabel: 'Etiquetas', page: 'Página',
    prev: 'Anterior', next: 'Siguiente', sponsored: 'Patrocinado', browse: 'Explorar el catálogo',
    untranslated: 'Descripción en inglés: esta página aún no está traducida por completo.',
    filters: 'Filtros', sort: 'Ordenar', newest: 'Más recientes', popular: 'Más descargados', top: 'Más destacados',
    name: 'Nombre', clear: 'Limpiar', results: 'resultados', noResults: 'Sin resultados',
    riskNone: 'Sin señales de riesgo', riskLow: 'Riesgo bajo', riskMedium: 'Riesgo medio',
    riskHigh: 'Riesgo alto', advTitle: 'Avisos de vulnerabilidades', installCmd: 'Comando de instalación',
    downloadStats: 'Descargas (30 días)', dshCompat: 'Requiere DSH', jsonLd: 'SoftwareApplication',
  },
  de: {
    home: 'Start', categories: 'Kategorien', tags: 'Tags', security: 'Sicherheit', blog: 'Blog',
    about: 'Über', search: 'Plugins suchen…', allCategories: 'Alle Kategorien', allTags: 'Alle Tags',
    plugins: 'Plugins', plugin: 'Plugin', install: 'Installieren', homepage: 'Webseite',
    repository: 'Repository', version: 'Version', owner: 'Autor', stars: 'Sterne', downloads: 'Downloads',
    added: 'Hinzugefügt', related: 'Verwandte Plugins', capabilities: 'Fähigkeiten', risk: 'Sicherheitsrisiko',
    advisories: 'Bekannte Hinweise', license: 'Lizenz', tagsLabel: 'Tags', page: 'Seite',
    prev: 'Zurück', next: 'Weiter', sponsored: 'Gesponsert', browse: 'Katalog durchsuchen',
    untranslated: 'Beschreibung auf Englisch — diese Seite ist noch nicht vollständig übersetzt.',
    filters: 'Filter', sort: 'Sortierung', newest: 'Neueste', popular: 'Meiste Downloads', top: 'Meiste Sterne',
    name: 'Name', clear: 'Zurücksetzen', results: 'Ergebnisse', noResults: 'Nichts gefunden',
    riskNone: 'Keine Risikohinweise', riskLow: 'Geringes Risiko', riskMedium: 'Mittleres Risiko',
    riskHigh: 'Hohes Risiko', advTitle: 'Schwachstellenmeldungen', installCmd: 'Installationsbefehl',
    downloadStats: 'Downloads (30 Tage)', dshCompat: 'Benötigt DSH', jsonLd: 'SoftwareApplication',
  },
  fr: {
    home: 'Accueil', categories: 'Catégories', tags: 'Tags', security: 'Sécurité', blog: 'Blog',
    about: 'À propos', search: 'Rechercher des plugins…', allCategories: 'Toutes les catégories', allTags: 'Tous les tags',
    plugins: 'plugins', plugin: 'plugin', install: 'Installer', homepage: 'Site',
    repository: 'Dépôt', version: 'Version', owner: 'Auteur', stars: 'Étoiles', downloads: 'Téléchargements',
    added: 'Ajouté', related: 'Plugins liés', capabilities: 'Capacités', risk: 'Risque de sécurité',
    advisories: 'Avis connus', license: 'Licence', tagsLabel: 'Tags', page: 'Page',
    prev: 'Précédent', next: 'Suivant', sponsored: 'Sponsorisé', browse: 'Parcourir le catalogue',
    untranslated: 'Description en anglais — cette page n’est pas encore entièrement traduite.',
    filters: 'Filtres', sort: 'Tri', newest: 'Plus récents', popular: 'Plus téléchargés', top: 'Plus étoilés',
    name: 'Nom', clear: 'Réinitialiser', results: 'résultats', noResults: 'Aucun résultat',
    riskNone: 'Aucun signal de risque', riskLow: 'Risque faible', riskMedium: 'Risque moyen',
    riskHigh: 'Risque élevé', advTitle: 'Avis de vulnérabilité', installCmd: 'Commande d’installation',
    downloadStats: 'Téléchargements (30 jours)', dshCompat: 'Nécessite DSH', jsonLd: 'SoftwareApplication',
  },
  ja: {
    home: 'ホーム', categories: 'カテゴリ', tags: 'タグ', security: 'セキュリティ', blog: 'ブログ',
    about: '概要', search: 'プラグインを検索…', allCategories: 'すべてのカテゴリ', allTags: 'すべてのタグ',
    plugins: 'プラグイン', plugin: 'プラグイン', install: 'インストール', homepage: 'サイト',
    repository: 'リポジトリ', version: 'バージョン', owner: '作者', stars: 'スター', downloads: 'ダウンロード',
    added: '追加日', related: '関連プラグイン', capabilities: '機能', risk: 'セキュリティリスク',
    advisories: '既知の脆弱性', license: 'ライセンス', tagsLabel: 'タグ', page: 'ページ',
    prev: '前へ', next: '次へ', sponsored: 'スポンサー', browse: 'カタログを見る',
    untranslated: '説明は英語表示 — このページはまだ完全には翻訳されていません。',
    filters: 'フィルター', sort: '並び替え', newest: '新着', popular: 'ダウンロード順', top: 'スター順',
    name: '名前', clear: 'クリア', results: '件', noResults: '見つかりません',
    riskNone: 'リスクフラグなし', riskLow: '低リスク', riskMedium: '中リスク',
    riskHigh: '高リスク', advTitle: '脆弱性の通知', installCmd: 'インストールコマンド',
    downloadStats: 'ダウンロード（30日）', dshCompat: 'DSH が必要', jsonLd: 'SoftwareApplication',
  },
};

export function t(locale, key) {
  return (UI[locale] || UI.en)[key] ?? UI.en[key] ?? key;
}

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const prefix = (locale) => (locale && locale !== 'en' ? `/${locale}` : '');

export function altUrl(locale, pathNoLocale) {
  const p = pathNoLocale.replace(/^\/(ru|zh|es|de|fr|ja)(\/|$)/, '/');
  return locale === 'en' ? `${SITE}${p}` : `${SITE}/${locale}${p === '/' ? '/' : p}`;
}

export const CATEGORY_TITLES = {
  agi: ['AGI Architecture Exploration', 'AGI 架构探索'],
  ui: ['UI Enhancements', 'UI 增强'],
  usage: ['Usage & Billing', '用量与计费'],
  theme: ['Themes & Appearance', '主题与外观'],
  model: ['Models & Providers', '模型与账号接入'],
  identity: ['Identity & Communication', '身份与通信'],
  session: ['Sessions & Messages', '会话与消息'],
  memory: ['Memory', '记忆'],
  tools: ['Tools & Capabilities', '工具与能力'],
  wsl: ['WSL & Windows Interop', 'WSL 与 Windows 互操作'],
  browser: ['Browser & Web', '浏览器与网页'],
  vision: ['Vision & Multimodal', '视觉与多模态'],
  voice: ['Voice & Audio', '语音与音频'],
  docs: ['Docs & Rendering', '文档与渲染'],
  skill: ['Skills', '技能包'],
  workflow: ['Workflow & Automation', '工作流与自动化'],
  git: ['Git & Code Review', 'Git 与代码评审'],
  notify: ['Notifications & Integrations', '通知与集成'],
  dev: ['Development & Runtime', '开发与运行时'],
  security: ['Security & Permissions', '安全与权限'],
  remote: ['Remote & Mobile', '远程与移动端'],
  market: ['Plugin Markets & Managers', '插件市场与管理'],
  fun: ['Just for Fun', '娱乐'],
};

export const catTitle = (cat, locale) => {
  const pair = CATEGORY_TITLES[cat] || [cat, cat];
  return locale === 'zh' ? pair[1] : pair[0];
};

export const RISK_LABEL = { none: 'riskNone', low: 'riskLow', medium: 'riskMedium', high: 'riskHigh' };

export const CSS_URL = '/site.css';

const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var th=s||(d?'dark':'light');document.documentElement.classList.toggle('light',th==='light');}catch(e){}})();`;

const MENU_SCRIPT = `
(function(){
  function closeAll(except){document.querySelectorAll('.menu.open').forEach(function(m){if(m!==except)m.classList.remove('open');});}
  document.querySelectorAll('.menu > button').forEach(function(b){
    b.addEventListener('click',function(e){e.stopPropagation();var m=b.parentElement;var was=m.classList.contains('open');closeAll();if(!was)m.classList.add('open');});
  });
  document.addEventListener('click',function(){closeAll();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll();});
  var h=document.getElementById('hamb'),m=document.getElementById('mobile');
  if(h&&m)h.addEventListener('click',function(){m.classList.toggle('open');});
  document.querySelectorAll('.mobile [data-acc]').forEach(function(hd){
    hd.addEventListener('click',function(){var p=hd.nextElementSibling;if(p)p.classList.toggle('open');});
  });
  var t=document.getElementById('theme-toggle');
  if(t)t.addEventListener('click',function(){var l=document.documentElement.classList.toggle('light');localStorage.setItem('theme',l?'light':'dark');});
})();
`;

/**
 * Full HTML document.
 * @param {object} o
 */
export function html(o) {
  const locale = o.locale || 'en';
  const pre = prefix(locale);
  const title = o.title;
  const description = o.description;
  const canonical = o.canonical || `${SITE}${o.path || '/'}`;
  const pathNoLocale = (o.path || '/').replace(/^\/(ru|zh|es|de|fr|ja)(\/|$)/, '/');
  const hreflangs = LOCALES.map(
    (l) => `<link rel="alternate" hreflang="${l.code}" href="${altUrl(l.code, pathNoLocale)}">`
  ).join('');
  const jsonld = o.jsonLd ? `<script type="application/ld+json">${JSON.stringify(o.jsonLd)}</script>` : '';
  return `<!doctype html>
<html lang="${locale}" class="${locale === 'en' ? '' : ''}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${o.keywords ? `<meta name="keywords" content="${esc(o.keywords)}">` : ''}
<link rel="canonical" href="${esc(canonical)}">
${hreflangs}<link rel="alternate" hreflang="x-default" href="${esc(altUrl('en', pathNoLocale))}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:image" content="${SITE}/og-default.png">
<meta property="og:locale" content="${locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/og-default.png">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0b1020">
${jsonld}
<link rel="stylesheet" href="${CSS_URL}" />
<script>${THEME_SCRIPT}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site">
  <div class="container hdr">
    <a class="brand" href="${pre}/">DSH <span>Market</span></a>
    <nav class="desktop" aria-label="Main">
      <div class="menu">
        <button aria-expanded="false" aria-haspopup="true">${esc(t(locale, 'categories'))} ▾</button>
        <div class="drop">
          ${(o.categories || []).map((c) => `<a href="${pre}/category/${c.slug}/">${esc(c.title)} <span style="color:var(--muted)">${c.count}</span></a>`).join('')}
        </div>
      </div>
      <div class="menu">
        <button aria-expanded="false" aria-haspopup="true">${esc(t(locale, 'tags'))} ▾</button>
        <div class="drop">
          ${(o.tags || []).map((tg) => `<a href="${pre}/tag/${tg.slug}/">${esc(tg.title)} <span style="color:var(--muted)">${tg.count}</span></a>`).join('')}
        </div>
      </div>
      <div class="menu">
        <button aria-expanded="false" aria-haspopup="true">${esc(t(locale, 'security'))} ▾</button>
        <div class="drop">
          <div class="grp">${esc(t(locale, 'security'))}</div>
          <a href="${pre}/security/">${esc(t(locale, 'advisories'))}</a>
          <a href="${pre}/security/#risk-high">${esc(t(locale, 'riskHigh'))}</a>
          <a href="${pre}/security/#risk-medium">${esc(t(locale, 'riskMedium'))}</a>
          <a href="${pre}/security/#risk-none">${esc(t(locale, 'riskNone'))}</a>
        </div>
      </div>
      <div class="menu">
        <button aria-expanded="false" aria-haspopup="true">${esc(t(locale, 'blog'))} ▾</button>
        <div class="drop">
          <a href="${pre}/blog/">${esc(t(locale, 'blog'))}</a>
          <a href="${pre}/changelog/">Changelog</a>
          <a href="${pre}/faq/">FAQ</a>
          <a href="${pre}/docs/">Docs</a>
          <a href="${pre}/docs/">Docs</a>
        </div>
      </div>
      <div class="menu">
        <button aria-expanded="false" aria-haspopup="true">${esc(t(locale, 'about'))} ▾</button>
        <div class="drop">
          <a href="${pre}/about/">${esc(t(locale, 'about'))}</a>
          <a href="https://dshmarket.com" rel="noopener nofollow" target="_blank">dshmarket.com</a>
          <a href="https://github.com/homgorn/harness-market-ds" rel="noopener nofollow" target="_blank">GitHub</a>
        </div>
      </div>
      <div class="menu">
        <button aria-expanded="false" aria-haspopup="true">🌐 ${esc((LOCALES.find((l) => l.code === locale) || LOCALES[0]).native)} ▾</button>
        <div class="drop">
          ${LOCALES.map((l) => `<a href="${altUrl(l.code, pathNoLocale).replace(SITE, '')}" hreflang="${l.code}"${l.code === locale ? ' aria-current="true"' : ''}>${esc(l.native)}</a>`).join('')}
        </div>
      </div>
      <button id="theme-toggle" aria-label="Toggle theme">◐</button>
    </nav>
    <button class="hamb" id="hamb" aria-label="Menu" aria-expanded="false">☰</button>
  </div>
  <div class="mobile" id="mobile">
    <a href="${pre}/">${esc(t(locale, 'home'))}</a>
    <a href="${pre}/category/">${esc(t(locale, 'allCategories'))}</a>
    <a href="${pre}/tags/">${esc(t(locale, 'allTags'))}</a>
    <a href="${pre}/security/">${esc(t(locale, 'security'))}</a>
    <a href="${pre}/blog/">${esc(t(locale, 'blog'))}</a>
    <a href="${pre}/about/">${esc(t(locale, 'about'))}</a>
    <a href="${pre}/search/">${esc(t(locale, 'search'))}</a>
  </div>
</header>
<main id="main" class="container">
${o.body || ''}
</main>
<footer class="site">
  <div class="container">
    <div class="fgrid">
      <div>
        <h4>${esc(t(locale, 'browse'))}</h4>
        <ul>
          <li><a href="${pre}/">${esc(t(locale, 'home'))}</a></li>
          <li><a href="${pre}/category/">${esc(t(locale, 'allCategories'))}</a></li>
          <li><a href="${pre}/tags/">${esc(t(locale, 'allTags'))}</a></li>
          <li><a href="${pre}/search/">${esc(t(locale, 'search'))}</a></li>
          <li><a href="${pre}/api/v1/plugins">API</a></li>
        </ul>
      </div>
      <div>
        <h4>${esc(t(locale, 'categories'))}</h4>
        <ul>
          ${(o.categories || []).slice(0, 8).map((c) => `<li><a href="${pre}/category/${c.slug}/">${esc(c.title)}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <h4>${esc(t(locale, 'categories'))}</h4>
        <ul>
          ${(o.categories || []).slice(8, 16).map((c) => `<li><a href="${pre}/category/${c.slug}/">${esc(c.title)}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <h4>${esc(t(locale, 'tags'))}</h4>
        <ul>
          ${(o.tags || []).slice(0, 8).map((tg) => `<li><a href="${pre}/tag/${tg.slug}/">${esc(tg.title)}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <h4>${esc(t(locale, 'about'))}</h4>
        <ul>
          <li><a href="${pre}/about/">${esc(t(locale, 'about'))}</a></li>
          <li><a href="${pre}/blog/">${esc(t(locale, 'blog'))}</a></li>
          <li><a href="${pre}/changelog/">Changelog</a></li>
          <li><a href="${pre}/faq/">FAQ</a></li>
          <li><a href="${pre}/docs/">Docs</a></li>
          <li><a href="${pre}/security/">${esc(t(locale, 'security'))}</a></li>
          <li><a href="${pre}/privacy/">Privacy</a></li>
          <li><a href="${pre}/terms/">Terms</a></li>
          <li><a href="${pre}/cookies/">Cookies</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-note">
      DSH Harness Plugin Catalog · open data from awesome-dsh-plugin.com and the DSH plugin index (CDN) ·
      <a href="${pre}/llms.txt">llms.txt</a> · <a href="${pre}/sitemap-index.xml">sitemap</a>
    </div>
  </div>
</footer>
<script>${MENU_SCRIPT}</script>
</body>
</html>`;
}

/** Compact plugin card used in listings. */
export function card(p, locale) {
  const pre = prefix(locale);
  const riskPill =
    p.rk === 'high'
      ? `<span class="pill bad">${esc(t(locale, 'riskHigh'))}</span>`
      : p.rk === 'medium'
        ? `<span class="pill warn">${esc(t(locale, 'riskMedium'))}</span>`
        : p.av > 0
          ? `<span class="pill warn">${p.av} CVE</span>`
          : '';
  return `<article class="card">
  <a class="t" href="${pre}/p/${p.s}/">${esc(p.n)}</a>
  <p class="d">${esc(p.de)}</p>
  <div class="meta">
    <span class="pill">${esc(catTitle(p.c, locale))}</span>
    ${p.v ? `<span class="pill">v${esc(p.v)}</span>` : ''}
    ${p.st ? `<span class="pill">★ ${p.st}</span>` : ''}
    ${p.dl ? `<span class="pill">↓ ${p.dl}</span>` : ''}
    ${riskPill}
  </div>
</article>`;
}

/** Pagination block. */
export function pager(base, page, totalPages, locale) {
  if (totalPages <= 1) return '';
  const parts = [];
  const mk = (n, label, cls) =>
    `<${cls === 'cur' ? 'span' : 'a'} class="${cls}"${cls === 'cur' ? ' aria-current="page"' : ` href="${base}${n === 1 ? '' : '/' + n}/"`}>${esc(label)}</${cls === 'cur' ? 'span' : 'a'}>`;
  if (page > 1) parts.push(mk(page - 1, '← ' + t(locale, 'prev'), 'pg'));
  const from = Math.max(1, page - 2);
  const to = Math.min(totalPages, from + 4);
  for (let i = from; i <= to; i++) parts.push(mk(i, String(i), i === page ? 'cur' : 'pg'));
  if (page < totalPages) parts.push(mk(page + 1, t(locale, 'next') + ' →', 'pg'));
  return `<nav class="pager" aria-label="Pagination">${parts.join('')}</nav>`;
}

/** JSON-LD for a plugin page. */
export function pluginJsonLd(p, locale, url) {
  const np = p.np || '';
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.n,
    description: p.de.slice(0, 300),
    url,
    applicationCategory: catTitle(p.c, 'en'),
    operatingSystem: 'DeepSeek Harness',
    softwareVersion: p.v || undefined,
    author: p.o ? { '@type': 'Person', name: p.o } : undefined,
    inLanguage: locale,
    sameAs: [p.u, np ? `https://www.npmjs.com/package/${np}` : null].filter(Boolean),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
  };
}
