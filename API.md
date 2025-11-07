# Commit.vn API Documentation

## Overview

Commit.vn uses a combination of:

- **Supabase Client SDK** for database operations
- **Next.js API Routes** for custom endpoints
- **Server Actions** for server-side logic

## Authentication

All API requests require authentication via Supabase Auth cookies.

### Get Current User

\`\`\`typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();
\`\`\`

## Database Operations

### Challenges

#### Create Challenge

\`\`\`typescript
const { data, error } = await supabase
.from('challenges')
.insert({
creator_id: user.id,
title: 'Go to gym 3x/week',
description: 'Build healthy habits',
stake_amount: 100000,
frequency: 'daily',
required_proofs: 21,
start_date: '2025-01-01',
end_date: '2025-01-31',
})
.select()
.single();
\`\`\`

#### Get User's Challenges

\`\`\`typescript
const { data, error } = await supabase
.from('challenges')
.select('\*')
.eq('creator_id', user.id)
.order('created_at', { ascending: false });
\`\`\`

#### Get Challenge by ID

\`\`\`typescript
const { data, error } = await supabase
.from('challenges')
.select('_, profiles(_)')
.eq('id', challengeId)
.single();
\`\`\`

#### Update Challenge Status

\`\`\`typescript
const { error } = await supabase
.from('challenges')
.update({ status: 'active', payment_status: 'paid' })
.eq('id', challengeId);
\`\`\`

### Squad Members

#### Invite Squad Members

\`\`\`typescript
const squadMembers = emails.map(email => ({
challenge_id: challengeId,
email,
status: 'pending',
}));

const { error } = await supabase
.from('squad_members')
.insert(squadMembers);
\`\`\`

#### Get Squad Members

\`\`\`typescript
const { data, error } = await supabase
.from('squad_members')
.select('_, profiles(_)')
.eq('challenge_id', challengeId);
\`\`\`

#### Accept Squad Invitation

\`\`\`typescript
const { error } = await supabase
.from('squad_members')
.update({
status: 'accepted',
user_id: user.id,
responded_at: new Date().toISOString(),
})
.eq('id', invitationId);
\`\`\`

### Proofs

#### Create Proof

\`\`\`typescript
const { data, error } = await supabase
.from('proofs')
.insert({
challenge_id: challengeId,
user_id: user.id,
media_url: publicUrl,
media_type: 'image', // or 'video'
caption: 'Finished workout',
proof_date: '2025-01-15',
status: 'pending',
});
\`\`\`

#### Get Challenge Proofs

\`\`\`typescript
const { data, error } = await supabase
.from('proofs')
.select('\*')
.eq('challenge_id', challengeId)
.order('proof_date', { ascending: false });
\`\`\`

#### Update Proof Status

\`\`\`typescript
const { error } = await supabase
.from('proofs')
.update({ status: 'approved' })
.eq('id', proofId);
\`\`\`

### Disputes

#### Create Dispute

\`\`\`typescript
const { data, error } = await supabase
.from('disputes')
.insert({
proof_id: proofId,
disputer_id: user.id,
reason: 'Photo does not show valid proof',
status: 'open',
});
\`\`\`

#### Get Proof Disputes

\`\`\`typescript
const { data, error } = await supabase
.from('disputes')
.select('_, profiles(_)')
.eq('proof_id', proofId);
\`\`\`

### Payments

#### Create Payment Record

\`\`\`typescript
const { data, error } = await supabase
.from('payments')
.insert({
challenge_id: challengeId,
user_id: user.id,
amount: stakeAmount,
type: 'stake',
status: 'pending',
});
\`\`\`

#### Get User Payments

\`\`\`typescript
const { data, error } = await supabase
.from('payments')
.select('\*')
.eq('user_id', user.id)
.order('created_at', { ascending: false });
\`\`\`

### Notifications

#### Create Notification

\`\`\`typescript
const { error } = await supabase
.from('notifications')
.insert({
user_id: targetUserId,
type: 'proof_submitted',
title: 'New Proof Submitted',
message: 'A new proof was submitted for your challenge',
link: \`/challenges/\${challengeId}\`,
read: false,
});
\`\`\`

#### Get User Notifications

\`\`\`typescript
const { data, error } = await supabase
.from('notifications')
.select('\*')
.eq('user_id', user.id)
.order('created_at', { ascending: false })
.limit(20);
\`\`\`

#### Mark Notification as Read

\`\`\`typescript
const { error } = await supabase
.from('notifications')
.update({ read: true })
.eq('id', notificationId);
\`\`\`

## Custom API Routes

### Upload Media

**Endpoint:** `POST /api/upload`

**Purpose:** Generate signed URL for uploading media to Cloudflare R2

**Request Body:**
\`\`\`json
{
"fileName": "gym-selfie.jpg",
"contentType": "image/jpeg",
"challengeId": "uuid"
}
\`\`\`

**Response:**
\`\`\`json
{
"uploadUrl": "https://r2.cloudflarestorage.com/...",
"key": "proofs/challenge-id/user-id/timestamp-filename",
"publicUrl": "https://your-r2-public-url/..."
}
\`\`\`

**Usage:**
\`\`\`typescript
// 1. Get signed URL
const response = await fetch('/api/upload', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
fileName: file.name,
contentType: file.type,
challengeId: challengeId,
}),
});

const { uploadUrl, publicUrl } = await response.json();

// 2. Upload file to R2
await fetch(uploadUrl, {
method: 'PUT',
body: file,
headers: { 'Content-Type': file.type },
});

// 3. Save publicUrl to database
await supabase.from('proofs').insert({
media_url: publicUrl,
// ... other fields
});
\`\`\`

## Email Functions

### Send Squad Invitation

\`\`\`typescript
import { sendSquadInvitation } from '@/lib/email';

await sendSquadInvitation(
'friend@example.com',
'Go to gym 3x/week',
'John Doe',
challengeId
);
\`\`\`

### Send Proof Notification

\`\`\`typescript
import { sendProofSubmittedNotification } from '@/lib/email';

await sendProofSubmittedNotification(
'squad@example.com',
'Go to gym 3x/week',
challengeId
);
\`\`\`

### Send Challenge Completion

\`\`\`typescript
import { sendChallengeCompletedEmail } from '@/lib/email';

await sendChallengeCompletedEmail(
'user@example.com',
'Go to gym 3x/week',
true, // success
100000 // amount
);
\`\`\`

## Cloudflare R2 Functions

### Upload File

\`\`\`typescript
import { uploadToR2 } from '@/lib/cloudflare-r2';

const publicUrl = await uploadToR2(
fileBuffer,
'proofs/challenge-id/user-id/file.jpg',
'image/jpeg'
);
\`\`\`

### Get Signed Upload URL

\`\`\`typescript
import { getSignedUploadUrl } from '@/lib/cloudflare-r2';

const uploadUrl = await getSignedUploadUrl(
'proofs/challenge-id/user-id/file.jpg',
'image/jpeg'
);
\`\`\`

### Get Signed Download URL

\`\`\`typescript
import { getSignedDownloadUrl } from '@/lib/cloudflare-r2';

const downloadUrl = await getSignedDownloadUrl(
'proofs/challenge-id/user-id/file.jpg'
);
\`\`\`

## Row Level Security (RLS) Policies

### Challenges

**Select:**

- Users can view their own challenges
- Squad members can view challenges they're invited to

**Insert:**

- Authenticated users can create challenges

**Update:**

- Only challenge creator can update

### Proofs

**Select:**

- Challenge creator can view proofs
- Squad members can view proofs

**Insert:**

- Only challenge creator can submit proofs

### Notifications

**Select/Update:**

- Users can only access their own notifications

## Real-time Subscriptions

### Subscribe to Challenge Updates

\`\`\`typescript
const channel = supabase
.channel('challenge-updates')
.on(
'postgres_changes',
{
event: '\*',
schema: 'public',
table: 'challenges',
filter: \`id=eq.\${challengeId}\`,
},
(payload) => {
console.log('Challenge updated:', payload);
}
)
.subscribe();

// Cleanup
channel.unsubscribe();
\`\`\`

### Subscribe to New Proofs

\`\`\`typescript
const channel = supabase
.channel('proof-updates')
.on(
'postgres_changes',
{
event: 'INSERT',
schema: 'public',
table: 'proofs',
filter: \`challenge_id=eq.\${challengeId}\`,
},
(payload) => {
console.log('New proof:', payload);
}
)
.subscribe();
\`\`\`

## Error Handling

### Supabase Errors

\`\`\`typescript
const { data, error } = await supabase
.from('challenges')
.select('\*');

if (error) {
console.error('Database error:', error);
// Handle error
// error.code - Error code
// error.message - Error message
// error.details - Additional details
}
\`\`\`

### API Route Errors

\`\`\`typescript
try {
const response = await fetch('/api/upload', {
method: 'POST',
body: JSON.stringify(data),
});

if (!response.ok) {
const error = await response.json();
throw new Error(error.error);
}

const result = await response.json();
} catch (error) {
console.error('API error:', error);
}
\`\`\`

## Rate Limits (To Implement)

Suggested rate limits for production:

- **Challenge Creation:** 10/hour per user
- **Proof Upload:** 50/day per challenge
- **API Requests:** 100/minute per user
- **Email Sending:** 20/hour per user

## Webhooks (Future)

Planned webhook events:

- `challenge.created`
- `challenge.completed`
- `proof.submitted`
- `proof.disputed`
- `payment.completed`

## GraphQL (Future)

Consider migrating to GraphQL for:

- Better type safety
- Reduced over-fetching
- Batch queries
- Real-time subscriptions

## Best Practices

### 1. Always Check Authentication

\`\`\`typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
// Redirect to login or return error
}
\`\`\`

### 2. Use Server-Side for Sensitive Operations

\`\`\`typescript
// Good - Server Component
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
const supabase = await createClient();
// ...
}

// Bad - Client Component with service role key
// Never expose service role key to client
\`\`\`

### 3. Handle Errors Gracefully

\`\`\`typescript
try {
const { data, error } = await supabase
.from('challenges')
.select('\*');

if (error) throw error;

// Process data
} catch (error) {
toast({
title: 'Error',
description: error.message,
variant: 'destructive',
});
}
\`\`\`

### 4. Validate Input

\`\`\`typescript
import { z } from 'zod';

const challengeSchema = z.object({
title: z.string().min(3).max(100),
stake_amount: z.number().min(1000).max(10000000),
start_date: z.string().datetime(),
// ...
});

const validated = challengeSchema.parse(formData);
\`\`\`

### 5. Use Transactions for Related Operations

\`\`\`typescript
// Create challenge and squad members together
const { data: challenge } = await supabase
.from('challenges')
.insert({ ... })
.select()
.single();

if (challenge) {
await supabase
.from('squad_members')
.insert(squadMembers.map(email => ({
challenge_id: challenge.id,
email,
})));
}
\`\`\`

## Testing

### Mock Supabase Client

\`\`\`typescript
import { vi } from 'vitest';

const mockSupabase = {
from: vi.fn(() => ({
select: vi.fn(() => ({
eq: vi.fn(() => ({
single: vi.fn(() => ({ data: mockData, error: null })),
})),
})),
})),
};
\`\`\`

### Test API Routes

\`\`\`typescript
import { POST } from '@/app/api/upload/route';

describe('/api/upload', () => {
it('generates signed URL', async () => {
const request = new Request('http://localhost:3000/api/upload', {
method: 'POST',
body: JSON.stringify({
fileName: 'test.jpg',
contentType: 'image/jpeg',
challengeId: 'test-id',
}),
});

    const response = await POST(request);
    const data = await response.json();

    expect(data.uploadUrl).toBeDefined();
    expect(data.publicUrl).toBeDefined();

});
});
\`\`\`

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Resend API Docs](https://resend.com/docs)

---

Last updated: 2025-11-07
