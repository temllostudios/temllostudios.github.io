// include-partials.js — dev/prod friendly include + meta fallback
(function () {
  const PARTIALS = {
    header: 'partials/header.html',
    footer: 'partials/footer.html'
  };
  const META_JSON = 'data/meta.json';

  function isLocalHost() {
    return location.protocol === 'file:' ||
           location.hostname === 'localhost' ||
           location.hostname === '127.0.0.1' ||
           location.hostname === '';
  }

  const PROD_BASE = (window.SITE_BASE_URL && String(window.SITE_BASE_URL).replace(/\/$/, '')) || null;
  const USE_BASE = (PROD_BASE && !isLocalHost()) ? PROD_BASE : '';

  async function fetchWithFallback(candidates) {
    for (const p of candidates) {
      try {
        const res = await fetch(p, {cache:'no-store'});
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.text();
      } catch (err) {
        // try next
      }
    }
    return null;
  }

  function resolveCandidates(path) {
    const c = [];
    if (USE_BASE) c.push(USE_BASE + '/' + path.replace(/^\//,''));
    c.push(path);
    c.push(path.replace(/^\//,''));
    return c;
  }

  async function includePartial(selector, path) {
    const el = document.querySelector(selector);
    if (!el) return;
    const html = await fetchWithFallback(resolveCandidates(path));
    if (html !== null) el.innerHTML = html;
    else console.error('Could not load partial:', path);
    return html;
  }

  function setMeta(attr, name, content) {
    if (!content) return;
    const sel = (attr === 'name') ? `meta[name="${name}"]` : `meta[property="${name}"]`;
    let el = document.head.querySelector(sel);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.content = content;
  }

  function setCanonical(url) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }

  async function applyMetaFromJson() {
    try {
      const raw = await fetchWithFallback(resolveCandidates(META_JSON));
      if (!raw) return;
      const meta = JSON.parse(raw);
      let pathKey = location.pathname;
      // Normalize keys for files served from root (strip leading '/')
      if (pathKey.startsWith('/')) pathKey = pathKey;
      // pick key
      let key = pathKey;
      if (!meta[key]) {
        if (!key.endsWith('/') && meta[key + '/']) key = key + '/';
        else key = '/';
      }
      const item = meta[key] || meta['/'] || {};
      if (item.title) document.title = item.title;
      setMeta('name','description', item.description);
      setMeta('property','og:title', item.title);
      setMeta('property','og:description', item.description);
      setMeta('property','og:image', (item.image || '').replace(/<BASE_URL>/g, USE_BASE || PROD_BASE || ''));
      setMeta('property','og:url', (item.canonical || ( (USE_BASE || PROD_BASE || '') + pathKey )).replace(/<BASE_URL>/g, USE_BASE || PROD_BASE || ''));
      setMeta('name','twitter:card', item.twitter_card || 'summary_large_image');
      setMeta('name','twitter:title', item.title);
      setMeta('name','twitter:description', item.description);
      setMeta('name','twitter:image', (item.image || '').replace(/<BASE_URL>/g, USE_BASE || PROD_BASE || ''));
      setCanonical((item.canonical || ((USE_BASE || PROD_BASE || '') + pathKey)).replace(/<BASE_URL>/g, USE_BASE || PROD_BASE || ''));
    } catch (e) {
      console.error('applyMetaFromJson error', e);
    }
  }

  // Initialize mobile menu function (make sure this exists in your project)
  function initializeMobileMenu() {
    // Add your mobile menu initialization code here
    // This function should be defined elsewhere in your project
    if (typeof window.initializeMobileMenu === 'function') {
      window.initializeMobileMenu();
    }
  }

  document.addEventListener('DOMContentLoaded', async function () {
    // Load header with mobile menu initialization
    await includePartial('#site-header', PARTIALS.header);
    // Initialize mobile menu after header is loaded
    initializeMobileMenu();

    // Load footer
    await includePartial('#site-footer', PARTIALS.footer);
    
    // Update year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    
    // Apply meta tags
    applyMetaFromJson();
  });
})();