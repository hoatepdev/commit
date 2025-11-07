import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Trophy, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
            Turn Your Goals Into{' '}
            <span className="text-primary">Commitments</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Stake money on your challenges. Stay accountable with friends. Win
            back your money or split it with your squad.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Target className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>1. Create Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set your goal and stake money on completing it. The higher the
                  stakes, the more motivated you'll be.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>2. Build Your Squad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Invite 1-5 friends as accountability partners. They'll verify
                  your progress and keep you honest.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>3. Submit Proof</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload photos or videos as proof. Your squad can challenge
                  invalid submissions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>4. Win or Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complete your challenge to get your money back. Fail, and your
                  squad splits the stake.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Commit to Your Goals?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of Vietnamese young adults achieving their goals
            through financial accountability.
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link href="/signup">Start Your First Challenge</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
