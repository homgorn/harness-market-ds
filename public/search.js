/* Client-side search + filtering.
   Replaces Pagefind: one compact JSON index instead of ~72,000 index files. */
(function () {
  var idx = null;
  var loaded = false;

  function load(cb) {
    if (loaded && idx) return cb(idx);
    if (loaded) return;
    loaded = true;
    fetch('/search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { idx = data; cb(idx); })
      .catch(function () { cb(null); });
  }

  function score(item, terms) {
    var name = item.n.toLowerCase();
    var desc = item.d.toLowerCase();
    var tags = item.t.join(' ').toLowerCase();
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      var s = 0;
      if (name === t) s = 60;
      else if (name.indexOf(t) === 0) s = 30;
      else if (name.indexOf(t) > -1) s = 18;
      else if (tags.indexOf(t) > -1) s = 12;
      else if (desc.indexOf(t) > -1) s = 6;
      else return 0;
      total += s;
    }
    var pop = item.p != null ? Math.max(0, 12 - item.p / 900) : 0;
    return total + pop;
  }

  function render(list, container, query) {
    var html = '';
    if (!list.length) {
      html = '<p class="lead">' + (container.dataset.empty || 'Nothing found') + '</p>';
    }
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      var risk = it.r === 'high' ? '<span class="pill bad">high risk</span>'
        : it.r === 'medium' ? '<span class="pill warn">medium risk</span>' : '';
      var stars = it.s2 ? '<span class="pill">★ ' + it.s2 + '</span>' : '';
      var dl = it.d2 ? '<span class="pill">↓ ' + it.d2 + '</span>' : '';
      html += '<article class="card"><a class="t" href="/p/' + it.s + '/">' + esc(it.n) + '</a>' +
        '<p class="d">' + esc(it.d) + '</p><div class="meta"><span class="pill">' + esc(it.k) + '</span>' +
        stars + dl + risk + '</div></article>';
    }
    container.innerHTML = html;
    if (query) history.replaceState(null, '', '?q=' + encodeURIComponent(query));
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function boot() {
    var input = document.getElementById('q');
    var out = document.getElementById('results');
    if (!input || !out) return;
    var params = new URLSearchParams(location.search);
    var initial = params.get('q') || '';
    input.value = initial;

    function run() {
      var q = input.value.trim().toLowerCase();
      if (!q) {
        out.innerHTML = '';
        history.replaceState(null, '', location.pathname);
        return;
      }
      load(function (data) {
        if (!data) { out.innerHTML = '<p class="lead">Search index unavailable.</p>'; return; }
        var terms = q.split(/\s+/).filter(Boolean);
        var hits = [];
        for (var i = 0; i < data.length; i++) {
          var s = score(data[i], terms);
          if (s > 0) hits.push([data[i], s]);
        }
        hits.sort(function (a, b) { return b[1] - a[1]; });
        render(hits.slice(0, 100).map(function (h) { return h[0]; }), out, input.value.trim());
      });
    }

    var t;
    input.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(run, 120);
    });
    if (initial) run();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
