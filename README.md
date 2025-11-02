# bright-sdk-i18n-client

Browser-friendly i18n utility used in BrightSDK projects. Provides:

- t(key, params) — translate by key with simple {param} replacement
- translateValue(value) — find default-locale key by value and return translated string in current locale
- addMessages(locale, messages) — merge messages
- setLocale/getLocale

Quick usage

```html
<script src="dist/brightsdk-i18n.bundle.js"></script>
<script>
  BrightSdkI18n.init({
    locale: 'es',
    defaultLocale: 'en',
    messages: { en: { hello: 'Hello' }, es: { hello: 'Hola' } }
  });
  # bright-sdk-i18n-client

  Browser-friendly i18n utility used in BrightSDK projects. Provides:

  - t(key, params) — translate by key with simple {param} replacement
  - translateValue(value) — find default-locale key by value and return translated string in current locale
  - addMessages(locale, messages) — merge messages
  - setLocale/getLocale

  Quick usage

  ```html
  <script src="dist/brightsdk-i18n.bundle.js"></script>
  <script>
    BrightSdkI18n.init({
      locale: 'es',
      defaultLocale: 'en',
      messages: { en: { hello: 'Hello' }, es: { hello: 'Hola' } }
    });
    document.body.textContent = BrightSdkI18n.t('hello');
  </script>
  ```

  ## Demo: `index.html`

  There is a demo page at the repository root: `index.html`. It demonstrates the browser loader (fetching JSON locale files listed in `example/locales/manifest.json`) and shows a small translations table.

  Project structure (minimal)

  ```
  bright-sdk-i18n-client/
  ├─ package.json
  ├─ README.md
  ├─ src/
  │  ├─ index.js        # public facade
  │  ├─ i18n.js         # core runtime
  │  └─ loaders/
  │     └─ browser-loader.js
  ├─ index.html         # demo
  ├─ example/
  │  └─ locales/
  │     ├─ manifest.json
  │     ├─ en.json
  │     ├─ ru.json
  │     └─ ...
  └─ dist/
     └─ brightsdk-i18n.bundle.js
  ```

  Usage snippet (browser)

  ```js
  import { I18n } from 'bright-sdk-i18n-client'

  await I18n.init({
    loader: { type: 'browser', dir: './example/locales', manifest: 'manifest.json' },
    locale: 'en',
    defaultLocale: 'en'
  })

  // then use:
  I18n.t('hello')
  I18n.translateValue('Some string to translate')
  ```

  Notes

  - The demo prefers the packaged bundle located at `releases/latest/brightsdk-i18n.bundle.js` if present; otherwise it falls back to importing `./src/index.js` during development.
  - To preview the demo locally run a simple static server from the package root, for example:

  ```bash
  # from util/bright-sdk-i18n-client
  npx http-server -c-1 .  # or: python -m http.server 8000
  ```

  Open `http://localhost:8080/index.html` (or the port used by your server) to view the demo.
