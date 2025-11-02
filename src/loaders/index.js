// Loader facade: pick the appropriate loader implementation at runtime.
// Exposes a single async `loadDir(dir, options)` function.

// Loader facade: only supports the file-backed loader (fs-based). This
// intentionally removes any 'example' browser loader indirection. If the
// runtime cannot import the file loader (for example in strict browser
// environments) the import will fail and the caller should handle the error.

// Simple loader facade: expose the file-based loader only and provide
// `init(defaultOptions)` returning a loader with `load(dir, options)`.
// Loader factory: return a loader implementation object based on options.type
// The loader object is expected to implement `init(defaultOptions)` or be
// directly usable. Currently we only provide the browser loader.
import * as browserLoader from './browser-loader.js';

export function getLoader(loaderOptions = {}) {
  const type = (loaderOptions && loaderOptions.type) || 'browser';
  if (type === 'browser') {
    // browserLoader.init accepts defaultOptions and returns { load, loadSync }
    return browserLoader.init(loaderOptions || {});
  }
  throw new Error(`Unsupported loader type: ${type}`);
}

export default { getLoader };
