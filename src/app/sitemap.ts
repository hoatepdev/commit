import { MetadataRoute } from 'next';
import { i18nConfig } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://commit.vn';

  // Generate URLs for each locale
  const routes = ['', '/dashboard', '/challenges/new'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  i18nConfig.locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            i18nConfig.locales.map((loc) => [loc, `${baseUrl}/${loc}${route}`])
          ),
        },
      });
    });
  });

  return sitemapEntries;
}
