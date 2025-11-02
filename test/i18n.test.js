import I18n from '../src/i18n.js';

describe('bright-sdk-i18n-client', () => {
  test('translates by key and falls back to default locale', () => {
    I18n.init({ locale: 'es', defaultLocale: 'en', messages: { en: { hello: 'Hello', bye: 'Goodbye' }, es: { hello: 'Hola' } } });
    expect(I18n.t('hello')).toBe('Hola');
    expect(I18n.t('bye')).toBe('Goodbye');
  });

  test('translateValue returns translated value by default-locale lookup', () => {
    expect(I18n.translateValue('Hello')).toBe('Hola');
  });
});
