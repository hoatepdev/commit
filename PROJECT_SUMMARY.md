# Commit.vn MVP - Project Summary

## Overview

**Commit.vn** is a Progressive Web App (PWA) designed to help Vietnamese Gen Z users (ages 18-30) achieve their personal goals through financial stakes and social accountability. The platform combines behavioral psychology (loss aversion) with social pressure to drive commitment and completion.

## Core Concept

Users create challenges with financial stakes, invite friends as accountability partners ("squad"), submit regular proof of progress, and either win their money back or lose it to their squad based on completion.

## Tech Stack Summary

| Category      | Technology              | Purpose                             |
| ------------- | ----------------------- | ----------------------------------- |
| **Frontend**  | Next.js 14 (App Router) | React framework with SSR/SSG        |
|               | TypeScript              | Type safety                         |
|               | Tailwind CSS            | Styling                             |
|               | Shadcn/ui               | Component library                   |
|               | PWA (next-pwa)          | Mobile-first experience             |
| **Backend**   | Supabase                | PostgreSQL database, Auth, Realtime |
| **Storage**   | Cloudflare R2           | Media (photos/videos)               |
| **Email**     | Resend                  | Transactional emails                |
| **Payments**  | PolarSH                 | Payment gateway                     |
| **Dev Tools** | ESLint, Prettier        | Code quality                        |
|               | Husky                   | Git hooks                           |
|               | Vitest                  | Unit testing                        |

## Project Structure

\`\`\`
commit/
├── public/
│ ├── manifest.json # PWA manifest
│ └── [app icons] # 192x192, 512x512
│
├── src/
│ ├── app/ # Next.js 14 App Router
│ │ ├── (auth)/ # Auth routes (login, signup)
│ │ ├── api/ # API routes
│ │ │ └── upload/ # File upload endpoint
│ │ ├── auth/
│ │ │ └── callback/ # OAuth callback
│ │ ├── challenges/ # Challenge routes
│ │ │ ├── new/ # Create challenge
│ │ │ └── [id]/ # Challenge detail
│ │ │ ├── page.tsx # View challenge
│ │ │ ├── payment/ # Payment page
│ │ │ └── submit-proof/ # Submit proof
│ │ ├── dashboard/ # User dashboard
│ │ ├── globals.css # Global styles
│ │ ├── layout.tsx # Root layout
│ │ └── page.tsx # Landing page
│ │
│ ├── components/
│ │ ├── ui/ # Shadcn UI components
│ │ │ ├── button.tsx
│ │ │ ├── card.tsx
│ │ │ ├── input.tsx
│ │ │ ├── label.tsx
│ │ │ ├── select.tsx
│ │ │ ├── badge.tsx
│ │ │ ├── progress.tsx
│ │ │ ├── avatar.tsx
│ │ │ ├── dropdown-menu.tsx
│ │ │ ├── toast.tsx
│ │ │ └── toaster.tsx
│ │ ├── navbar.tsx # Navigation bar
│ │ └── proof-list.tsx # Proof list component
│ │
│ ├── lib/
│ │ ├── supabase/ # Supabase clients
│ │ │ ├── client.ts # Browser client
│ │ │ ├── server.ts # Server client
│ │ │ └── middleware.ts # Auth middleware
│ │ ├── cloudflare-r2.ts # R2 storage utilities
│ │ ├── email.ts # Email sending
│ │ └── utils.ts # Utility functions
│ │
│ ├── types/
│ │ └── database.types.ts # Supabase types
│ │
│ ├── hooks/
│ │ └── use-toast.ts # Toast hook
│ │
│ ├── test/
│ │ └── setup.ts # Test setup
│ │
│ └── middleware.ts # Next.js middleware
│
├── supabase/
│ └── schema.sql # Database schema
│
├── .husky/
│ └── pre-commit # Git pre-commit hook
│
├── Configuration files
├── next.config.mjs # Next.js config
├── tailwind.config.ts # Tailwind config
├── tsconfig.json # TypeScript config
├── vitest.config.ts # Vitest config
├── .eslintrc.json # ESLint config
├── .prettierrc # Prettier config
├── .lintstagedrc.json # Lint-staged config
├── package.json # Dependencies
└── .env.example # Environment template
\`\`\`

## Database Schema

### Core Tables

**profiles**

- User profile information (extends Supabase auth.users)
- Fields: id, email, full_name, avatar_url, phone

**challenges**

- Challenge definitions
- Fields: id, creator_id, title, description, stake_amount, frequency, required_proofs, start_date, end_date, status, payment_status

**squad_members**

- Accountability partners
- Fields: id, challenge_id, user_id, email, status (pending/accepted/declined)

**proofs**

- Progress submissions
- Fields: id, challenge_id, user_id, media_url, media_type, caption, proof_date, status

**disputes**

- Proof challenges
- Fields: id, proof_id, disputer_id, reason, status, resolution

**payments**

- Financial transactions
- Fields: id, challenge_id, user_id, amount, type (stake/refund/payout), status

**notifications**

- User notifications
- Fields: id, user_id, type, title, message, read

## Key Features

### 1. Authentication System

- **Email/Password**: Standard signup/login
- **Magic Link**: Passwordless authentication
- **Session Management**: Supabase Auth with cookies
- **Protected Routes**: Middleware-based protection

**Files:**

- [src/app/(auth)/login/page.tsx](<src/app/(auth)/login/page.tsx>)
- [src/app/(auth)/signup/page.tsx](<src/app/(auth)/signup/page.tsx>)
- [src/app/auth/callback/route.ts](src/app/auth/callback/route.ts)
- [src/middleware.ts](src/middleware.ts)

### 2. Challenge Creation

- **Multi-step Form**: Title, description, stake, frequency, dates
- **Squad Invitation**: Add 1-5 emails
- **Validation**: Client and server-side
- **Payment Flow**: Redirect to payment after creation

**Files:**

- [src/app/challenges/new/page.tsx](src/app/challenges/new/page.tsx)
- [src/app/challenges/[id]/payment/page.tsx](src/app/challenges/[id]/payment/page.tsx)

### 3. Proof Upload System

- **File Upload**: Photos and videos
- **Cloudflare R2**: Signed URLs for secure upload
- **Preview**: Client-side preview before upload
- **Metadata**: Caption and date

**Files:**

- [src/app/challenges/[id]/submit-proof/page.tsx](src/app/challenges/[id]/submit-proof/page.tsx)
- [src/app/api/upload/route.ts](src/app/api/upload/route.ts)
- [src/lib/cloudflare-r2.ts](src/lib/cloudflare-r2.ts)

### 4. Challenge Dashboard

- **Active Challenges**: View ongoing commitments
- **Squad Challenges**: See challenges you're supporting
- **Statistics**: Active count, completed count, total staked
- **Navigation**: Quick access to all features

**Files:**

- [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)
- [src/app/challenges/[id]/page.tsx](src/app/challenges/[id]/page.tsx)

### 5. Payment Integration

- **Stake Payment**: On challenge creation
- **Simulated Flow**: Mock payment for MVP
- **PolarSH Ready**: Infrastructure for real payments
- **Status Tracking**: Pending → Paid → Refunded/Distributed

**Files:**

- [src/app/challenges/[id]/payment/page.tsx](src/app/challenges/[id]/payment/page.tsx)

### 6. Email Notifications

- **Squad Invitations**: Sent to accountability partners
- **Proof Notifications**: Alert squad of new submissions
- **Challenge Results**: Completion/failure notifications
- **Resend Integration**: Transactional email service

**Files:**

- [src/lib/email.ts](src/lib/email.ts)

### 7. Progressive Web App

- **Installable**: Add to home screen
- **Offline Support**: Service worker (via next-pwa)
- **Mobile Optimized**: Responsive design
- **App-like**: Standalone display mode

**Files:**

- [public/manifest.json](public/manifest.json)
- [next.config.mjs](next.config.mjs)

## User Flows

### Challenge Creation Flow

1. User logs in
2. Clicks "New Challenge"
3. Fills form (title, stake, dates, squad)
4. Submits → Creates DB record
5. Redirected to payment
6. Completes payment → Challenge becomes active
7. Squad receives email invitations

### Proof Submission Flow

1. User opens active challenge
2. Clicks "Submit Proof"
3. Selects photo/video
4. Adds caption and date
5. Uploads to R2 via signed URL
6. Creates proof record in DB
7. Squad receives notification

### Verification Flow (Future Enhancement)

1. Squad member opens challenge
2. Views pending proofs
3. Approves or disputes
4. If disputed, creator can respond
5. Majority vote determines outcome

### Completion Flow (Future Enhancement)

1. Challenge end date reached
2. System counts approved proofs
3. If count >= required_proofs → SUCCESS
4. If success → Refund stake
5. If failure → Distribute to squad
6. Send completion emails

## Environment Setup

### Required Services

1. **Supabase** (Database + Auth)
   - Free tier available
   - Setup time: ~5 minutes

2. **Cloudflare R2** (Media Storage)
   - 10GB free per month
   - Setup time: ~5 minutes

3. **Resend** (Email)
   - 100 emails/day free
   - Setup time: ~10 minutes (domain verification)

4. **PolarSH** (Payments)
   - Merchant account required
   - Setup time: ~15 minutes

### Environment Variables

Total: 15 environment variables needed
See [.env.example](.env.example) for complete list

## Development

### Getting Started

\`\`\`bash

# Install

npm install

# Configure

cp .env.example .env

# Edit .env with your credentials

# Setup database

# Run supabase/schema.sql in Supabase dashboard

# Run

npm run dev
\`\`\`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI

## Security Considerations

### Implemented

- ✅ Row Level Security (RLS) on all tables
- ✅ Server-side authentication checks
- ✅ Signed URLs for media upload
- ✅ CSRF protection (Next.js built-in)
- ✅ SQL injection prevention (Supabase client)
- ✅ XSS protection (React escaping)

### To Add

- ⚠️ Rate limiting on API routes
- ⚠️ File upload size limits
- ⚠️ Content moderation for proofs
- ⚠️ 2FA for high-stake challenges
- ⚠️ Fraud detection

## Performance Optimizations

### Implemented

- ✅ Next.js automatic code splitting
- ✅ Image optimization (next/image)
- ✅ Server-side rendering
- ✅ Database indexes
- ✅ PWA caching

### Future

- ⚠️ CDN for static assets
- ⚠️ Database query optimization
- ⚠️ Lazy loading components
- ⚠️ Image compression
- ⚠️ Edge functions

## Testing

### Current Coverage

- ✅ Vitest setup
- ✅ Test utilities configured
- ⚠️ Unit tests (to be added)
- ⚠️ Integration tests (to be added)
- ⚠️ E2E tests (to be added)

### Testing Strategy

1. Unit tests for utilities (lib/)
2. Component tests for UI
3. Integration tests for flows
4. E2E tests for critical paths

## Deployment

### Recommended: Vercel

- Zero-config deployment
- Automatic HTTPS
- Edge functions
- Preview deployments

### Steps:

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Post-Deployment:

- Update Supabase redirect URLs
- Verify email sending
- Test payment flow
- Monitor errors

## Future Enhancements

### Phase 2

- [ ] Push notifications
- [ ] In-app messaging
- [ ] Leaderboards
- [ ] Achievements/badges
- [ ] Social sharing
- [ ] Challenge templates

### Phase 3

- [ ] Mobile apps (React Native)
- [ ] Team challenges
- [ ] Corporate/workplace challenges
- [ ] Analytics dashboard
- [ ] AI-powered insights
- [ ] Gamification

### Phase 4

- [ ] Marketplace for challenges
- [ ] Challenge categories
- [ ] Public/private challenges
- [ ] Sponsorship opportunities
- [ ] Community features

## Known Limitations (MVP)

1. **Payment**: Simulated, not real integration with PolarSH
2. **Verification**: Squad can view but not officially verify proofs
3. **Completion**: Manual check, not automated
4. **Disputes**: UI exists but logic incomplete
5. **Notifications**: Email only, no push
6. **Media**: Limited file type validation
7. **Search**: No search functionality
8. **Analytics**: Basic stats only

## Cost Estimates (Monthly)

### Free Tier (Development)

- Supabase: Free (500MB DB, 1GB storage)
- R2: Free (10GB)
- Resend: Free (100 emails/day)
- Vercel: Free
- **Total: $0/month**

### Production (1000 users)

- Supabase: ~$25 (Pro plan)
- R2: ~$5 (storage + requests)
- Resend: ~$10 (3000 emails)
- Vercel: Free (or $20 for Pro)
- PolarSH: 2.9% + 30¢ per transaction
- **Total: ~$40-60/month + transaction fees**

## Documentation

- [README.md](README.md) - Main documentation
- [SETUP.md](SETUP.md) - Detailed setup guide
- [QUICKSTART.md](QUICKSTART.md) - 5-minute quick start
- This file - Technical overview

## Support & Contact

- Issues: GitHub Issues
- Email: [Add your email]
- Documentation: README.md

## License

[Add your license]

---

**Built with ❤️ for Vietnamese Gen Z**

Last updated: 2025-11-07
Version: 0.1.0 (MVP)
