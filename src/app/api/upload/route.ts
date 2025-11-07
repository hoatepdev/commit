import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSignedUploadUrl } from '@/lib/cloudflare-r2';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileName, contentType, challengeId } = await request.json();

    if (!fileName || !contentType || !challengeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user is creator of the challenge
    const { data: challenge } = await supabase
      .from('challenges')
      .select('creator_id')
      .eq('id', challengeId)
      .single();

    if (!challenge || challenge.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized for this challenge' },
        { status: 403 }
      );
    }

    // Generate unique key for R2
    const timestamp = Date.now();
    const key = `proofs/${challengeId}/${user.id}/${timestamp}-${fileName}`;

    // Get signed upload URL
    const uploadUrl = await getSignedUploadUrl(key, contentType);

    return NextResponse.json({
      uploadUrl,
      key,
      publicUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
    });
  } catch (error: any) {
    console.error('Upload URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
