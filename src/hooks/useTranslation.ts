'use client';

import { useParams } from 'next/navigation';
import { i18nConfig, type Locale } from '@/i18n/config';
import {
  interpolate,
  getPluralKey,
  getNestedValue,
  formatNumber,
  formatCurrencyI18n,
  formatDateI18n,
} from '@/i18n/utils/interpolate';

type TranslationParams = Record<string, string | number>;

type TranslationFunction = {
  (key: string, params?: TranslationParams): string;
  rich: (key: string, params?: TranslationParams) => string;
  plural: (key: string, count: number, params?: TranslationParams) => string;
};

type FormatFunction = {
  number: (value: number, options?: Intl.NumberFormatOptions) => string;
  currency: (value: number, currency?: string) => string;
  date: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
};

/**
 * Client-side translation hook
 * Usage: const { t, locale, format } = useTranslation(dictionary);
 */
export function useTranslation(dictionary: Record<string, any>) {
  const params = useParams();
  const locale = (params?.lang as Locale) || i18nConfig.defaultLocale;

  const t: TranslationFunction = (key: string, tParams?: TranslationParams) => {
    const value = getNestedValue(dictionary, key);

    if (!value) {
      // Development: show missing key
      if (process.env.NODE_ENV === 'development') {
        return `[missing:${key}]`;
      }
      // Production: return key as fallback
      return key;
    }

    return interpolate(value, tParams);
  };

  // Rich text translation (preserves HTML)
  t.rich = (key: string, tParams?: TranslationParams) => {
    return t(key, tParams);
  };

  // Pluralization helper
  t.plural = (key: string, count: number, tParams?: TranslationParams) => {
    const translation = getPluralKey(key, count, dictionary);
    return interpolate(translation, { count, ...tParams });
  };

  // Format helpers
  const format: FormatFunction = {
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, locale, options),

    currency: (value: number, currency: string = 'VND') =>
      formatCurrencyI18n(value, locale, currency),

    date: (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
      formatDateI18n(date, locale, options),
  };

  return {
    t,
    locale,
    format,
  };
}

/**
 * Get current locale from URL params
 */
export function useLocale(): Locale {
  const params = useParams();
  return (params?.lang as Locale) || i18nConfig.defaultLocale;
}
