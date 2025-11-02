// Lightweight bootstrap for browser examples.
// Tries to locate a friendly loader (example/browser loader) first, then falls back to src loader.
// Exports `bootstrap(options)` which will load messages, ensure an I18n implementation is present
// and initialize it. This keeps the example HTML tiny.

// Use the browser loader (fetch-based). The package exposes a minimal loader
// with `{ init, load }` API. We import the browser implementation which is
// safe to import in client environments.
import * as loaders from './loaders/index.js';
// Statically import the runtime so webpack can produce a single-file UMD bundle
// (avoids emitting an additional async chunk). The runtime implements the
// actual translation methods (init, t, translateValue, addMessages, etc.).
import I18nRuntime from './i18n.js';

async function _init(options = {}) {
  const {
    // options.loader must be an object: { type: 'auto'|'file'|'example'|'<module-path>', dir, manifest }
    loader = { type: 'auto', dir: './locales', manifest: 'manifest.json' },
    locale = 'es_ES',
    defaultLocale = 'en_US',
  } = options;

  // loader is expected to be an object; merge with defaults.
  const loaderObj = Object.assign({ type: 'file', dir: './locales', manifest: 'manifest.json' }, loader);

  let messages = {};
  try {
    // If caller provided messages explicitly, use them and skip loader.
    if (options && options.messages && typeof options.messages === 'object') {
      messages = options.messages;
    } else {
      // Use the simple loader API: init(defaultOptions) -> { load(dir, options) }
      const loader = loaders.getLoader(loaderObj);
      if (!loader || typeof loader.load !== 'function') {
        throw new Error('loader does not implement init/load API');
      }
      messages = await loader.load(loaderObj.dir, loaderObj);
    }
  } catch (e) {
    console.error('Failed to load locales via loader', e);
    throw e;
  }

  // obtain i18n implementation — prefer an already-installed global, otherwise
  // use the statically imported runtime (I18nRuntime).
  let I18n = (typeof window !== 'undefined' && window.BrightSdkI18n) || null;
  if (!I18n) {
    I18n = I18nRuntime || null;
    if (!I18n) throw new Error('i18n runtime not available');
    if (typeof window !== 'undefined') window.BrightSdkI18n = I18n;
  }

  I18n.init({ locale, defaultLocale, messages });
  console.log('i18n messages loaded', Object.keys(messages));

  return { I18n, messages };
}

// Public I18n facade exported from this module. Consumers import this object and
// call I18n.init(options) to initialize translations. The other methods are
// convenience proxies to the runtime BrightSdkI18n implementation (when present).
export const I18n = {
  init: _init,
  t: (key, params) => (typeof window !== 'undefined' && window.BrightSdkI18n) ? window.BrightSdkI18n.t(key, params) : key,
  translateValue: (val) => (typeof window !== 'undefined' && window.BrightSdkI18n) ? window.BrightSdkI18n.translateValue(val) : val,
  addMessages: (locale, msgs) => (typeof window !== 'undefined' && window.BrightSdkI18n) ? window.BrightSdkI18n.addMessages(locale, msgs) : null,
  setLocale: (l) => (typeof window !== 'undefined' && window.BrightSdkI18n) ? window.BrightSdkI18n.setLocale(l) : null,
  getLocale: () => (typeof window !== 'undefined' && window.BrightSdkI18n) ? window.BrightSdkI18n.getLocale() : undefined
};

export default I18n;
