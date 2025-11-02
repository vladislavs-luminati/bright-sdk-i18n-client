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

const defaultLoader = { type: 'file', dir: './locales', manifest: 'manifest.json' };

async function _init(options = {}) {
  const {
    // options.loader must be an object: { type: 'auto'|'file'|'example'|'<module-path>', dir, manifest }
    loader = defaultLoader,
    locale = 'es_ES',
    defaultLocale = 'en_US',
  } = options;

  // loader is expected to be an object; merge with defaults.
  const loaderObj = Object.assign(defaultLoader, loader);

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

  // obtain i18n implementation — prefer an already-installed global runtime
  // if present, otherwise use the statically imported runtime. To avoid
  // accidental recursion when the bundle exports the facade as the global
  // object (the UMD wrapper assigns the bundle export to window.BrightSdkI18n),
  // we capture the runtime in a local variable and use it directly.
  const _runtime = (typeof window !== 'undefined' && window.__BrightSdkI18nRuntime) || I18nRuntime || null;
  if (!_runtime) throw new Error('i18n runtime not available');

  // Initialize the runtime directly and return it. Do not overwrite
  // `window.BrightSdkI18n` here — the UMD wrapper will export the facade and
  // we keep the runtime reference local to avoid self-recursive proxies.
  _runtime.init({ locale, defaultLocale, messages });
  console.log('i18n messages loaded', Object.keys(messages));

  return { I18n: _runtime, messages };
}

// Public I18n facade exported from this module. Consumers import this object and
// call I18n.init(options) to initialize translations. The other methods are
// convenience proxies to the runtime BrightSdkI18n implementation (when present).
// Expose a facade that delegates to the statically-imported runtime instance
// to avoid calling the global `window.BrightSdkI18n` (which will point to the
// facade itself after bundling). Use a private runtime reference.
const _facadeRuntime = (typeof window !== 'undefined' && window.__BrightSdkI18nRuntime) || I18nRuntime;
export const I18n = {
  init: _init,
  t: (key, params) => _facadeRuntime ? _facadeRuntime.t(key, params) : key,
  translateValue: (val) => _facadeRuntime ? _facadeRuntime.translateValue(val) : val,
  addMessages: (locale, msgs) => _facadeRuntime ? _facadeRuntime.addMessages(locale, msgs) : null,
  setLocale: (l) => _facadeRuntime ? _facadeRuntime.setLocale(l) : null,
  getLocale: () => _facadeRuntime ? _facadeRuntime.getLocale() : undefined
};

export default I18n;
