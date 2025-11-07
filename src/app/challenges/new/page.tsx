'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

export default function NewChallengePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>(
    'daily'
  );
  const [requiredProofs, setRequiredProofs] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [squadEmails, setSquadEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const addSquadMember = () => {
    if (emailInput && squadEmails.length < 5) {
      if (!squadEmails.includes(emailInput)) {
        setSquadEmails([...squadEmails, emailInput]);
        setEmailInput('');
      }
    }
  };

  const removeSquadMember = (email: string) => {
    setSquadEmails(squadEmails.filter((e) => e !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to create a challenge');
      }

      if (squadEmails.length < 1 || squadEmails.length > 5) {
        throw new Error('You must invite 1-5 squad members');
      }

      // Create challenge
      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .insert({
          creator_id: user.id,
          title,
          description,
          stake_amount: parseFloat(stakeAmount),
          frequency,
          required_proofs: parseInt(requiredProofs),
          start_date: startDate,
          end_date: endDate,
          status: 'pending',
        })
        .select()
        .single();

      if (challengeError) throw challengeError;

      // Invite squad members
      const squadMembersData = squadEmails.map((email) => ({
        challenge_id: challenge.id,
        email,
        status: 'pending' as const,
      }));

      const { error: squadError } = await supabase
        .from('squad_members')
        .insert(squadMembersData);

      if (squadError) throw squadError;

      toast({
        title: 'Success!',
        description: 'Challenge created successfully. Proceed to payment.',
      });

      // Redirect to payment page
      router.push(`/challenges/${challenge.id}/payment`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Challenge</CardTitle>
          <CardDescription>
            Set your goal, stake money, and invite your accountability squad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Challenge Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Go to gym 3x/week"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe your challenge..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Challenge Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stakeAmount">Stake Amount (VND)</Label>
                <Input
                  id="stakeAmount"
                  type="number"
                  placeholder="100000"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  required
                  min="1000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Proof Frequency</Label>
                <Select
                  value={frequency}
                  onValueChange={(value: any) => setFrequency(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredProofs">Required Proofs</Label>
                <Input
                  id="requiredProofs"
                  type="number"
                  placeholder="e.g., 21 for 21 days"
                  value={requiredProofs}
                  onChange={(e) => setRequiredProofs(e.target.value)}
                  required
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Squad Members */}
            <div className="space-y-4">
              <Label>Accountability Squad (1-5 members)</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addSquadMember())
                  }
                />
                <Button
                  type="button"
                  onClick={addSquadMember}
                  disabled={squadEmails.length >= 5 || !emailInput}
                >
                  Add
                </Button>
              </div>

              {squadEmails.length > 0 && (
                <div className="space-y-2">
                  {squadEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <span className="text-sm">{email}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSquadMember(email)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                {squadEmails.length}/5 squad members added
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || squadEmails.length === 0}
            >
              {loading
                ? 'Creating...'
                : 'Create Challenge & Proceed to Payment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
