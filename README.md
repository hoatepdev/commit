# Commit.vn - Commitment Platform MVP

A Progressive Web App that helps users achieve their goals through financial stakes and social accountability.

## Features

- **Challenge Creation**: Create personal challenges with financial stakes
- **Squad System**: Invite 1-5 friends as accountability partners
- **Proof Upload**: Submit photos/videos as progress proof
- **Verification**: Squad members can verify or challenge submissions
- **Payment Integration**: Secure payment handling with PolarSH
- **PWA Support**: Install on mobile devices for native-like experience

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- PWA capabilities

### Backend

- Supabase (PostgreSQL, Auth, Realtime)
- Cloudflare R2 (Media storage)
- Resend (Transactional emails)
- PolarSH (Payment gateway)

### Dev Tools

- ESLint + Prettier
- Husky (Git hooks)
- Vitest (Unit testing)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- Cloudflare R2 account
- Resend account
- PolarSH account

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd commit
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install

# or

yarn install

# or

pnpm install
\`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

Edit \`.env\` with your actual credentials:

\`\`\`env

# Supabase

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudflare R2

R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=commit-vn-media
NEXT_PUBLIC_R2_PUBLIC_URL=your_r2_public_url

# Resend

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@commit.vn

# PolarSH

POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_ORGANIZATION_ID=your_polar_org_id
NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY=your_polar_publishable_key

# App

NEXT_PUBLIC_APP_URL=http://localhost:9000
\`\`\`

### Database Setup

1. Create a new Supabase project

2. Run the database schema:
   \`\`\`bash

# Copy the contents of supabase/schema.sql and run it in Supabase SQL Editor

\`\`\`

3. Set up Row Level Security (RLS) policies (included in schema.sql)

### Cloudflare R2 Setup

1. Create an R2 bucket named \`commit-vn-media\`

2. Generate API tokens with read/write permissions

3. Configure public access for the bucket (optional, for serving media)

### Development

Start the development server:

\`\`\`bash
npm run dev

# or

yarn dev

# or

pnpm dev
\`\`\`

Open [http://localhost:9000](http://localhost:9000) in your browser.

### Testing

Run tests:
\`\`\`bash
npm run test

# or with UI

npm run test:ui
\`\`\`

### Building for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

## Project Structure

\`\`\`
commit/
├── public/ # Static assets
│ ├── manifest.json # PWA manifest
│ └── icons/ # App icons
├── src/
│ ├── app/ # Next.js app directory
│ │ ├── (auth)/ # Auth pages (login, signup)
│ │ ├── api/ # API routes
│ │ ├── challenges/ # Challenge pages
│ │ └── dashboard/ # Dashboard
│ ├── components/ # React components
│ │ └── ui/ # Shadcn UI components
│ ├── lib/ # Utility libraries
│ │ ├── supabase/ # Supabase client
│ │ ├── cloudflare-r2.ts
│ │ ├── email.ts
│ │ └── utils.ts
│ ├── types/ # TypeScript types
│ └── hooks/ # Custom React hooks
├── supabase/
│ └── schema.sql # Database schema
└── ...config files
\`\`\`

## Key Features Implementation

### Authentication

- Email/password sign up and login
- Magic link authentication
- Session management with Supabase

### Challenge Flow

1. User creates challenge with details and stake amount
2. Invites 1-5 squad members via email
3. Completes payment to activate challenge
4. Submits proofs (photos/videos) regularly
5. Squad members verify submissions
6. Challenge completes - win/fail determined
7. Payments distributed accordingly

### Proof Upload

- Upload to Cloudflare R2 via signed URLs
- Support for images and videos
- Caption and date metadata
- Status tracking (pending, approved, disputed, rejected)

### Payment System

- Stake payment on challenge creation
- Refund on successful completion
- Distribution to squad on failure
- Integration with PolarSH (payment gateway)

## Environment Variables

| Variable                      | Description               |
| ----------------------------- | ------------------------- |
| NEXT_PUBLIC_SUPABASE_URL      | Supabase project URL      |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anonymous key    |
| SUPABASE_SERVICE_ROLE_KEY     | Supabase service role key |
| R2_ACCOUNT_ID                 | Cloudflare R2 account ID  |
| R2_ACCESS_KEY_ID              | R2 access key             |
| R2_SECRET_ACCESS_KEY          | R2 secret key             |
| R2_BUCKET_NAME                | R2 bucket name            |
| NEXT_PUBLIC_R2_PUBLIC_URL     | Public URL for R2 media   |
| RESEND_API_KEY                | Resend API key            |
| RESEND_FROM_EMAIL             | From email address        |
| POLAR_ACCESS_TOKEN            | PolarSH access token      |
| NEXT_PUBLIC_APP_URL           | App URL                   |

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:

- Netlify
- Railway
- AWS Amplify
- Self-hosted

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions:

- Create an issue in the repository
- Contact: [your-email@example.com]

---

Built with ❤️ for the Vietnamese Gen Z community
