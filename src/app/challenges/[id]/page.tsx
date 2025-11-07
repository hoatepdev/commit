import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { formatCurrency, formatDate, getDaysRemaining } from '@/lib/utils';
import { Calendar, DollarSign, Target, Users } from 'lucide-react';
import { ProofList } from '@/components/proof-list';

export default async function ChallengePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch challenge details
  const { data: challenge } = await supabase
    .from('challenges')
    .select('*, profiles(*)')
    .eq('id', params.id)
    .single();

  if (!challenge) {
    redirect('/dashboard');
  }

  // Fetch squad members
  const { data: squadMembers } = await supabase
    .from('squad_members')
    .select('*, profiles(*)')
    .eq('challenge_id', params.id);

  // Fetch proofs
  const { data: proofs } = await supabase
    .from('proofs')
    .select('*')
    .eq('challenge_id', params.id)
    .order('proof_date', { ascending: false });

  const isCreator = challenge.creator_id === user.id;
  const progress = proofs
    ? (proofs.filter((p) => p.status !== 'rejected').length /
        challenge.required_proofs) *
      100
    : 0;

  const statusColors = {
    pending: 'bg-yellow-500',
    active: 'bg-green-500',
    completed: 'bg-blue-500',
    failed: 'bg-red-500',
    cancelled: 'bg-gray-500',
  };

  return (
    <div className="container mx-auto p-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">{challenge.title}</h1>
            <p className="text-muted-foreground">{challenge.description}</p>
          </div>
          <Badge className={statusColors[challenge.status]}>
            {challenge.status.toUpperCase()}
          </Badge>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-bold">
                  {proofs?.filter((p) => p.status !== 'rejected').length || 0}/
                  {challenge.required_proofs}
                </span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Challenge Details */}
          <Card>
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Stake</p>
                    <p className="font-bold">
                      {formatCurrency(Number(challenge.stake_amount))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Days Left</p>
                    <p className="font-bold">
                      {getDaysRemaining(challenge.end_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="font-bold capitalize">
                      {challenge.frequency}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Squad Size</p>
                    <p className="font-bold">{squadMembers?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p>
                  {formatDate(challenge.start_date)} -{' '}
                  {formatDate(challenge.end_date)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Proofs Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Proof Submissions</CardTitle>
                {isCreator && challenge.status === 'active' && (
                  <Button asChild>
                    <Link href={`/challenges/${params.id}/submit-proof`}>
                      Submit Proof
                    </Link>
                  </Button>
                )}
              </div>
              <CardDescription>
                Upload photos or videos to track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProofList proofs={proofs || []} isCreator={isCreator} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Squad Members */}
          <Card>
            <CardHeader>
              <CardTitle>Accountability Squad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {squadMembers?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {member.profiles?.full_name || member.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                    <Badge
                      variant={
                        member.status === 'accepted' ? 'default' : 'secondary'
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>
                ))}
                {(!squadMembers || squadMembers.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No squad members yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          {isCreator && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={
                    challenge.payment_status === 'paid'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {challenge.payment_status.toUpperCase()}
                </Badge>
                {challenge.payment_status === 'pending' && (
                  <Button asChild className="mt-4 w-full">
                    <Link href={`/challenges/${params.id}/payment`}>
                      Complete Payment
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
