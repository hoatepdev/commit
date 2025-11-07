import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'Commit.vn - Achieve Your Goals with Financial Stakes',
  description:
    'Create challenges, stake money, and stay accountable with friends. Turn your commitments into achievements.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Commit.vn',
  },
};

export const viewport: Viewport = {
  themeColor: '#2B5561',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
