'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { i18nConfig, type Locale, LOCALE_COOKIE } from '@/i18n/config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { saveLocalePreference } from '@/i18n/utils/detectLocale';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>(
    i18nConfig.defaultLocale
  );

  useEffect(() => {
    // Extract locale from pathname
    const pathSegments = pathname.split('/');
    const localeFromPath = pathSegments[1] as Locale;

    if (i18nConfig.locales.includes(localeFromPath)) {
      setCurrentLocale(localeFromPath);
    }
  }, [pathname]);

  const switchLocale = (newLocale: Locale) => {
    // Save preference
    saveLocalePreference(newLocale);

    // Set cookie
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=31536000`;

    // Update URL
    const segments = pathname.split('/');
    const currentPathLocale = segments[1];

    if (i18nConfig.locales.includes(currentPathLocale as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join('/');
    router.push(newPath);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {i18nConfig.localeFlags[currentLocale]}{' '}
            {i18nConfig.localeLabels[currentLocale]}
          </span>
          <span className="sm:hidden">
            {i18nConfig.localeFlags[currentLocale]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18nConfig.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLocale(locale)}
            className="flex items-center gap-2"
          >
            <span>{i18nConfig.localeFlags[locale]}</span>
            <span>{i18nConfig.localeLabels[locale]}</span>
            {currentLocale === locale && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
