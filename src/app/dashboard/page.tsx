import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Target, Trophy, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, getDaysRemaining } from '@/lib/utils';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user's challenges
  const { data: challenges } = await supabase
    .from('challenges')
    .select('*')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch challenges where user is a squad member
  const { data: squadChallenges } = await supabase
    .from('squad_members')
    .select('challenge_id, challenges(*)')
    .eq('user_id', user.id)
    .eq('status', 'accepted');

  const activeChallenges =
    challenges?.filter((c) => c.status === 'active') ?? [];
  const completedChallenges =
    challenges?.filter((c) => c.status === 'completed') ?? [];

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your challenges and progress
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/challenges/new">
            <Plus className="mr-2 h-5 w-5" />
            New Challenge
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Challenges
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeChallenges.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedChallenges.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                activeChallenges.reduce(
                  (sum, c) => sum + Number(c.stake_amount),
                  0
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Challenges */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Active Challenges</h2>
        {activeChallenges.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-4 text-lg text-muted-foreground">
                No active challenges yet
              </p>
              <Button asChild>
                <Link href="/challenges/new">Create Your First Challenge</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeChallenges.map((challenge) => (
              <Link key={challenge.id} href={`/challenges/${challenge.id}`}>
                <Card className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>{challenge.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {challenge.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Stake:</span>
                        <span className="font-bold">
                          {formatCurrency(Number(challenge.stake_amount))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Days Left:
                        </span>
                        <span className="font-bold">
                          {getDaysRemaining(challenge.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Frequency:
                        </span>
                        <span className="capitalize">
                          {challenge.frequency}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Squad Challenges */}
      {squadChallenges && squadChallenges.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-bold">Squad Challenges</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {squadChallenges.map((item: any) => (
              <Link
                key={item.challenge_id}
                href={`/challenges/${item.challenge_id}`}
              >
                <Card className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>{item.challenges.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Supporting as accountability partner
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
