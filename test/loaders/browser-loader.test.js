import { load, init } from '../../src/loaders/browser-loader.js';

describe('browser-loader', () => {
  const manifest = ['en.json', 'ru.json'];

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.endsWith('manifest.json')) {
        return Promise.resolve({ ok: true, json: async () => manifest });
      }
      if (url.endsWith('en.json')) {
        return Promise.resolve({ ok: true, json: async () => ({ hello: 'Hello' }) });
      }
      if (url.endsWith('ru.json')) {
        return Promise.resolve({ ok: true, json: async () => ({ hello: 'Привет' }) });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('load() fetches manifest and locale files', async () => {
    const msgs = await load('./locales', { manifest: 'manifest.json' });
    expect(msgs).toBeDefined();
  expect(msgs.en).toBeDefined();
  expect(msgs.en.hello).toBe('Hello');
  expect(msgs.ru.hello).toBe('Привет');
  });

  test('init().load() delegates to load()', async () => {
    const loader = init({ dir: './locales', manifest: 'manifest.json' });
  const msgs = await loader.load(undefined, {});
  expect(msgs.en.hello).toBe('Hello');
  });
});
