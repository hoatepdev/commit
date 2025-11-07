'use client';

import { Database } from '@/types/database.types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { AlertCircle, CheckCircle, Clock, Image, Video } from 'lucide-react';

type Proof = Database['public']['Tables']['proofs']['Row'];

interface ProofListProps {
  proofs: Proof[];
  isCreator: boolean;
}

export function ProofList({ proofs, isCreator }: ProofListProps) {
  if (!proofs || proofs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No proofs submitted yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proofs.map((proof) => (
        <Card key={proof.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Media Preview */}
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                {proof.media_type === 'image' ? (
                  <Image className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <Video className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{formatDate(proof.proof_date)}</p>
                  <Badge
                    variant={
                      proof.status === 'approved'
                        ? 'default'
                        : proof.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {proof.status === 'approved' && (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    )}
                    {proof.status === 'disputed' && (
                      <AlertCircle className="mr-1 h-3 w-3" />
                    )}
                    {proof.status === 'pending' && (
                      <Clock className="mr-1 h-3 w-3" />
                    )}
                    {proof.status}
                  </Badge>
                </div>

                {proof.caption && (
                  <p className="text-sm text-muted-foreground">
                    {proof.caption}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(proof.media_url, '_blank')}
                  >
                    View Media
                  </Button>
                  {!isCreator && proof.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      Challenge
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
