'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, Loader2 } from 'lucide-react';

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setChallenge(data);
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

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create payment record
      const { error: paymentError } = await supabase.from('payments').insert({
        challenge_id: params.id,
        user_id: user.id,
        amount: challenge.stake_amount,
        type: 'stake',
        status: 'pending',
      });

      if (paymentError) throw paymentError;

      // TODO: Integrate with PolarSH API
      // For MVP, we'll simulate payment success
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update challenge payment status
      const { error: updateError } = await supabase
        .from('challenges')
        .update({ payment_status: 'paid', status: 'active' })
        .eq('id', params.id);

      if (updateError) throw updateError;

      toast({
        title: 'Payment Successful!',
        description: 'Your challenge is now active',
      });

      router.push(`/challenges/${params.id}`);
      router.refresh();
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Complete Payment</CardTitle>
          <CardDescription>
            Stake your commitment to complete this challenge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Challenge Summary */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">Challenge Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Title:</span>
                <span className="font-medium">{challenge.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stake Amount:</span>
                <span className="font-bold text-primary">
                  {formatCurrency(Number(challenge.stake_amount))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>
                  {new Date(challenge.start_date).toLocaleDateString()} -{' '}
                  {new Date(challenge.end_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-lg bg-muted p-4">
            <div className="mb-2 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">How it works</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Your stake is held securely until the challenge ends</li>
              <li>• Complete your challenge to get your money back</li>
              <li>
                • If you fail, the stake is split among your accountability
                squad
              </li>
              <li>• Payment is processed securely through PolarSH</li>
            </ul>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={processing || challenge.payment_status === 'paid'}
            className="w-full"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : challenge.payment_status === 'paid' ? (
              'Payment Completed'
            ) : (
              <>Pay {formatCurrency(Number(challenge.stake_amount))}</>
            )}
          </Button>

          {challenge.payment_status === 'paid' && (
            <Button
              variant="outline"
              onClick={() => router.push(`/challenges/${params.id}`)}
              className="w-full"
            >
              Go to Challenge
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
