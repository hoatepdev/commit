/**
 * Simple interpolation utility for translation strings
 * Supports: {{key}}, pluralization, and basic formatting
 */

type InterpolationParams = Record<string, string | number>;

/**
 * Interpolate variables in translation string
 * Example: "Hello {{name}}" with {name: "John"} => "Hello John"
 */
export function interpolate(
  template: string,
  params?: InterpolationParams
): string {
  if (!params) return template;

  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}

/**
 * Handle pluralization
 * Example: key="item" or key="item_plural" based on count
 */
export function getPluralKey(
  key: string,
  count: number,
  translations: Record<string, any>
): string {
  // Check if plural key exists
  const pluralKey = `${key}_plural`;

  if (count === 1) {
    return translations[key] || translations[pluralKey] || key;
  }

  return translations[pluralKey] || translations[key] || key;
}

/**
 * Format numbers based on locale
 */
export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format currency based on locale
 */
export function formatCurrencyI18n(
  value: number,
  locale: string,
  currency: string = 'VND'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format date based on locale
 */
export function formatDateI18n(
  date: Date | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(
    new Date(date)
  );
}

/**
 * Get nested value from object using dot notation
 * Example: get(obj, 'app.name') => obj.app.name
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
