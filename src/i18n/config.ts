/**
 * i18n Configuration for CamKết.vn (Commit.vn)
 * Supports: en (default), vi (Vietnamese)
 */

export const i18nConfig = {
  defaultLocale: 'en' as const,
  locales: ['en', 'vi'] as const, // Extend to ['en', 'vi'] later
  localeLabels: {
    en: 'English',
    vi: 'Tiếng Việt',
  },
  localeFlags: {
    en: '🇺🇸',
    vi: '🇻🇳',
  },
} as const;

export type Locale = (typeof i18nConfig.locales)[number];
export type LocaleLabels = typeof i18nConfig.localeLabels;
export type LocaleFlags = typeof i18nConfig.localeFlags;

export const LOCALE_COOKIE = 'NEXT_LOCALE';
export const LOCALE_STORAGE_KEY = 'camket-locale';
