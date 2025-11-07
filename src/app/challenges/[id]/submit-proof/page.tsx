'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon } from 'lucide-react';

export default function SubmitProofPage({
  params,
}: {
  params: { id: string };
}) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [proofDate, setProofDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get signed upload URL from API
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          challengeId: params.id,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, publicUrl } = await uploadResponse.json();

      // Upload file to R2
      const uploadResult = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResult.ok) {
        throw new Error('Failed to upload file');
      }

      // Create proof record in database
      const { error: proofError } = await supabase.from('proofs').insert({
        challenge_id: params.id,
        user_id: user.id,
        media_url: publicUrl,
        media_type: file.type.startsWith('image/') ? 'image' : 'video',
        caption,
        proof_date: proofDate,
        status: 'pending',
      });

      if (proofError) throw proofError;

      toast({
        title: 'Success!',
        description: 'Proof submitted successfully',
      });

      router.push(`/challenges/${params.id}`);
      router.refresh();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Submit Proof</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">Photo or Video</Label>
              <div className="flex flex-col gap-4">
                <Input
                  id="file"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  required
                />

                {preview && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                    {file?.type.startsWith('image/') ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground" />
                        <p className="ml-4 text-muted-foreground">
                          Video selected: {file?.name}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!preview && (
                  <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed">
                    <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload a photo or video as proof
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Input
                id="caption"
                placeholder="Add a description..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            {/* Proof Date */}
            <div className="space-y-2">
              <Label htmlFor="proofDate">Proof Date</Label>
              <Input
                id="proofDate"
                type="date"
                value={proofDate}
                onChange={(e) => setProofDate(e.target.value)}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!file || uploading}
                className="flex-1"
              >
                {uploading ? 'Uploading...' : 'Submit Proof'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
