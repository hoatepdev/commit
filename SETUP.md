# Commit.vn Setup Guide

This guide will walk you through setting up the Commit.vn MVP from scratch.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A package manager (npm, yarn, or pnpm)
- Git installed
- A code editor (VS Code recommended)

## Step 1: Clone and Install

\`\`\`bash

# Clone the repository

git clone <your-repo-url>
cd commit

# Install dependencies

npm install

# or

yarn install

# or

pnpm install
\`\`\`

## Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose an organization
4. Fill in project details:
   - Name: "commit-vn"
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Wait for project to be created

### 2.2 Get Supabase Credentials

1. Go to Project Settings → API
2. Copy the following:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

### 2.3 Run Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Paste and run in SQL Editor
4. Verify tables are created in Table Editor

## Step 3: Cloudflare R2 Setup

### 3.1 Create R2 Bucket

1. Log into Cloudflare Dashboard
2. Go to R2 Object Storage
3. Click "Create bucket"
4. Name it: `commit-vn-media`
5. Click "Create bucket"

### 3.2 Generate R2 API Tokens

1. Go to R2 → Overview
2. Click "Manage R2 API Tokens"
3. Click "Create API token"
4. Permissions: "Object Read & Write"
5. Copy:
   - Access Key ID → `R2_ACCESS_KEY_ID`
   - Secret Access Key → `R2_SECRET_ACCESS_KEY`
   - Account ID (from URL) → `R2_ACCOUNT_ID`

### 3.3 Configure Public Access (Optional)

1. Go to your bucket settings
2. Enable "Public access" if you want direct media URLs
3. Copy the public URL → `NEXT_PUBLIC_R2_PUBLIC_URL`

## Step 4: Resend Setup

### 4.1 Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up and verify email
3. Complete onboarding

### 4.2 Add Domain

1. Go to Domains
2. Click "Add Domain"
3. Enter your domain (e.g., commit.vn)
4. Add DNS records as instructed
5. Wait for verification

### 4.3 Get API Key

1. Go to API Keys
2. Click "Create API Key"
3. Name: "Commit.vn Production"
4. Copy key → `RESEND_API_KEY`
5. Set `RESEND_FROM_EMAIL` to your verified email

## Step 5: PolarSH Setup

### 5.1 Create PolarSH Account

1. Go to [polar.sh](https://polar.sh)
2. Sign up
3. Complete merchant verification

### 5.2 Get API Credentials

1. Go to Settings → API
2. Create API token
3. Copy:
   - Access Token → `POLAR_ACCESS_TOKEN`
   - Organization ID → `POLAR_ORGANIZATION_ID`
   - Publishable Key → `NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY`

## Step 6: Environment Variables

Create a `.env` file in the project root:

\`\`\`bash
cp .env.example .env
\`\`\`

Fill in all the credentials you collected:

\`\`\`env

# Supabase

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudflare R2

R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=commit-vn-media
NEXT_PUBLIC_R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com

# Resend

RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@commit.vn

# PolarSH

POLAR_ACCESS_TOKEN=polar_xxxxx
POLAR_ORGANIZATION_ID=org_xxxxx
NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY=pk_xxxxx

# App

NEXT_PUBLIC_APP_URL=http://localhost:9000
NODE_ENV=development
\`\`\`

## Step 7: Development

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:9000

## Step 8: Testing

### Test Authentication

1. Go to /signup
2. Create an account
3. Check email for verification
4. Log in at /login

### Test Challenge Creation

1. After logging in, go to /challenges/new
2. Fill out the form
3. Add squad members
4. Submit (payment will be simulated in dev mode)

### Test Proof Upload

1. Go to an active challenge
2. Click "Submit Proof"
3. Upload an image or video
4. Verify it appears in the challenge

## Step 9: Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables from `.env`
6. Deploy

### Post-Deployment

1. Update `NEXT_PUBLIC_APP_URL` to your production URL
2. Update Supabase redirect URLs:
   - Go to Authentication → URL Configuration
   - Add your production URL to Redirect URLs
3. Update Resend domain if needed
4. Test all flows in production

## Troubleshooting

### Supabase Connection Issues

- Verify credentials in `.env`
- Check if project is paused (free tier)
- Ensure RLS policies are set up correctly

### R2 Upload Failures

- Verify API token permissions
- Check bucket name matches exactly
- Ensure CORS is configured if needed

### Email Not Sending

- Verify domain is verified in Resend
- Check API key is valid
- Look at Resend dashboard logs

### Payment Issues

- Ensure PolarSH account is verified
- Check API credentials
- Review PolarSH dashboard for errors

## Next Steps

After setup:

1. Customize the branding and colors
2. Add your own logo and app icons
3. Configure PWA icons (192x192 and 512x512)
4. Set up monitoring and analytics
5. Test on mobile devices
6. Gather user feedback

## Support

For issues:

- Check the main README.md
- Review Supabase/R2/Resend/PolarSH docs
- Open an issue on GitHub

Happy building! 🚀
