import type { Locale } from '../config';

type Dictionary = {
  [key: string]: any;
};

type DictionaryModule = 'common' | 'commitment';

const dictionaries: Record<
  Locale,
  Record<DictionaryModule, () => Promise<Dictionary>>
> = {
  en: {
    common: () => import('../locales/en/common.json').then((m) => m.default),
    commitment: () =>
      import('../locales/en/commitment.json').then((m) => m.default),
  },
  vi: {
    common: () => import('../locales/vi/common.json').then((m) => m.default),
    commitment: () =>
      import('../locales/vi/commitment.json').then((m) => m.default),
  },
};

function deepMerge(base: Dictionary, override: Dictionary): Dictionary {
  const output: Dictionary = { ...base };

  for (const [key, overrideValue] of Object.entries(override ?? {})) {
    const baseValue = output[key];

    if (
      overrideValue &&
      typeof overrideValue === 'object' &&
      !Array.isArray(overrideValue) &&
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
    ) {
      output[key] = deepMerge(baseValue, overrideValue);
    } else {
      output[key] = overrideValue;
    }
  }

  return output;
}

/**
 * Get dictionary for a specific locale and module
 * Falls back to English if locale not found
 */
export async function getDictionary(
  locale: Locale,
  module: DictionaryModule = 'common'
): Promise<Dictionary> {
  try {
    const dict = await dictionaries[locale]?.[module]();
    return dict || {};
  } catch (error) {
    console.warn(
      `Failed to load ${module} dictionary for ${locale}, falling back to en`
    );
    try {
      return await dictionaries.en[module]();
    } catch (fallbackError) {
      console.error(`Failed to load fallback dictionary for ${module}`);
      return {};
    }
  }
}

/**
 * Get all dictionaries for a locale (common + commitment)
 */
export async function getAllDictionaries(locale: Locale) {
  const [requestedCommon, requestedCommitment] = await Promise.all([
    getDictionary(locale, 'common'),
    getDictionary(locale, 'commitment'),
  ]);

  if (locale === 'en') {
    return {
      common: requestedCommon,
      commitment: requestedCommitment,
    };
  }

  const [fallbackCommon, fallbackCommitment] = await Promise.all([
    getDictionary('en', 'common'),
    getDictionary('en', 'commitment'),
  ]);

  return {
    common: deepMerge(fallbackCommon, requestedCommon),
    commitment: deepMerge(fallbackCommitment, requestedCommitment),
  };
}
