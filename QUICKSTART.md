# Quick Start Guide

Get Commit.vn running in 5 minutes! (Development mode with mock data)

## Prerequisites

- Node.js 18+
- npm/yarn/pnpm

## 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

## 2. Set Up Environment

For quick testing, create a minimal `.env` file:

\`\`\`bash

# Copy example

cp .env.example .env
\`\`\`

**Minimum required for development:**

- Supabase credentials (free tier)
- Other services can be mocked initially

### Get Free Supabase Credentials (2 minutes)

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create new project
3. Go to Settings → API
4. Copy to `.env`:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

### Set Up Database (1 minute)

1. In Supabase dashboard, go to SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Paste and run
4. Done!

## 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:9000](http://localhost:9000)

## 4. Test the App

### Create an Account

1. Click "Sign Up"
2. Enter email and password
3. Check email for verification link
4. Click link to verify

### Create Your First Challenge

1. After logging in, click "New Challenge"
2. Fill in:
   - Title: "Go to gym 3x/week"
   - Stake: 100000
   - Duration: 30 days
   - Add 1-2 email addresses as squad
3. Submit

### Payment (Dev Mode)

In development, payment is simulated - it will auto-complete after 2 seconds.

### Submit Proof

1. Go to your challenge
2. Click "Submit Proof"
3. Upload any image
4. Submit

## What Works in Dev Mode

✅ Authentication (real, via Supabase)
✅ Database operations (real)
✅ Challenge creation
✅ Dashboard
✅ Payment simulation
⚠️ File uploads (needs R2 setup)
⚠️ Email sending (needs Resend setup)

## Adding Full Features

To enable all features, follow [SETUP.md](./SETUP.md) for:

- Cloudflare R2 (media uploads)
- Resend (emails)
- PolarSH (real payments)

## Common Issues

**"Invalid Supabase credentials"**

- Double-check URL and keys in `.env`
- Ensure project isn't paused

**"Database error"**

- Run the schema.sql in Supabase SQL Editor
- Check table creation in Table Editor

**"Can't sign up"**

- Check Supabase email settings
- Enable email auth in Supabase dashboard

## Next Steps

1. Customize colors in [tailwind.config.ts](./tailwind.config.ts)
2. Add your logo to [public/](./public/)
3. Review code in [src/](./src/)
4. Read full [README.md](./README.md)

Need help? Check [SETUP.md](./SETUP.md) for detailed instructions!
