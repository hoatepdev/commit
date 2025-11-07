import { i18nConfig, type Locale, LOCALE_STORAGE_KEY } from '../config';

/**
 * Detect user's preferred locale from various sources
 * Priority: URL > localStorage > Cookie > Browser > Default
 */
export function detectLocale(request?: Request): Locale {
  // 1. Check URL pathname
  if (request) {
    const pathname = new URL(request.url).pathname;
    const locale = pathname.split('/')[1] as Locale;
    if (i18nConfig.locales.includes(locale)) {
      return locale;
    }
  }

  // 2. Check browser localStorage (client-side only)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && i18nConfig.locales.includes(stored as Locale)) {
      return stored as Locale;
    }
  }

  // 3. Check Accept-Language header (server-side)
  if (request) {
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      const preferred = acceptLanguage
        .split(',')[0]
        .split('-')[0]
        .toLowerCase();

      const matchedLocale = i18nConfig.locales.find((loc) =>
        loc.toLowerCase().startsWith(preferred)
      );

      if (matchedLocale) {
        return matchedLocale;
      }
    }
  }

  // 4. Check browser language (client-side only)
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    const matchedLocale = i18nConfig.locales.find((loc) =>
      loc.toLowerCase().startsWith(browserLang)
    );

    if (matchedLocale) {
      return matchedLocale;
    }
  }

  // 5. Default fallback
  return i18nConfig.defaultLocale;
}

/**
 * Save locale preference to localStorage
 */
export function saveLocalePreference(locale: Locale): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

/**
 * Get locale from localStorage
 */
export function getStoredLocale(): Locale | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && i18nConfig.locales.includes(stored as Locale)) {
      return stored as Locale;
    }
  }
  return null;
}
