import type { Metadata } from 'next';
import '../globals.css';
import { Navbar } from '@/components/navbar-i18n';
import { i18nConfig, type Locale } from '@/i18n/config';
import { getAllDictionaries } from '@/i18n/utils/getDictionary';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const { lang } = params;
  const { common } = await getAllDictionaries(lang);

  return {
    title: common.app.tagline,
    description: common.app.description,
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: common.app.name,
    },
    alternates: {
      languages: {
        en: '/en',
        vi: '/vi',
        'x-default': '/vi',
      },
    },
  };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ lang: locale }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const { lang } = params;

  if (!i18nConfig.locales.includes(lang)) {
    notFound();
  }

  const { common } = await getAllDictionaries(lang);

  return (
    <>
      <Navbar lang={lang} labels={common.nav} brandName={common.app.name} />
      {children}
    </>
  );
}
