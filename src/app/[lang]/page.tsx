import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Trophy, Shield } from 'lucide-react';
import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getAllDictionaries } from '@/i18n/utils/getDictionary';

export default async function Home({ params }: { params: { lang: Locale } }) {
  const { lang } = params;
  const { common } = await getAllDictionaries(lang);

  const iconMap = {
    target: Target,
    users: Users,
    shield: Shield,
    trophy: Trophy,
  } as const;

  const features = (
    common.features as Array<{
      icon: keyof typeof iconMap;
      title: string;
      description: string;
    }>
  ).map((f) => ({
    icon: iconMap[f.icon] ?? Target,
    title: f.title,
    description: f.description,
  }));

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
            {common.hero.titleStart}{' '}
            <span className="text-primary">{common.hero.titleEmphasis}</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            {common.app.description}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href={`/${lang}/signup`}>{common.cta.getStarted}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link href={`/${lang}/login`}>{common.nav.login}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            {common.home.howItWorks}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="mb-2 h-10 w-10 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">{common.cta.readyTitle}</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            {lang === 'vi'
              ? 'Tham gia hàng nghìn người trẻ Việt Nam đạt được mục tiêu thông qua trách nhiệm tài chính.'
              : 'Join thousands of Vietnamese young adults achieving their goals through financial accountability.'}
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link href={`/${lang}/signup`}>
              {common.cta.startFirstChallenge}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
