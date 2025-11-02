// Browser loader: fetch-based implementation exposing a minimal { init, load }
// API. Safe to import in browser contexts.

export async function load(dir = './locales', options = {}) {
  const base = String(dir).replace(/\/$/, '');
  const manifest = options && options.manifest ? options.manifest : 'manifest.json';
  const manifestUrl = `${base}/${manifest}`;

  const res = await fetch(manifestUrl);
  if (!res.ok) throw new Error(`Failed to fetch manifest: ${manifestUrl} (${res.status})`);
  const files = await res.json();

  const messages = {};
  await Promise.all((files || []).map(async (fname) => {
    try {
      const r = await fetch(`${base}/${fname}`);
      if (!r.ok) return;
      messages[fname.replace(/\.json$/, '')] = await r.json();
    } catch (e) {
      // ignore individual file failures
    }
  }));

  return messages;
}

export function init(defaultOptions = {}) {
  return {
    load: (dir, opts = {}) => load(dir || defaultOptions.dir || './locales', Object.assign({}, defaultOptions, opts)),
  };
}

export default { init };
