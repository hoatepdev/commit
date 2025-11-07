'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Target, User, LogOut, Settings } from 'lucide-react';
import { type Locale } from '@/i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  lang: Locale;
  labels: {
    home: string;
    dashboard: string;
    newChallenge: string;
    profile: string;
    settings: string;
    login: string;
    signup: string;
    signout: string;
  };
  brandName: string;
}

export function Navbar({ lang, labels, brandName }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();

  // labels are provided from server dictionaries via props

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = `/${lang}`;
  };

  // Don't show navbar on auth pages
  if (pathname?.includes('/login') || pathname?.includes('/signup')) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href={user ? `/${lang}/dashboard` : `/${lang}`}
          className="flex items-center gap-2"
        >
          <Target className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">{brandName}</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href={`/${lang}/dashboard`}>{labels.dashboard}</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={`/${lang}/challenges/new`}>
                  {labels.newChallenge}
                </Link>
              </Button>
              <LanguageSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${lang}/profile`} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {labels.profile}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${lang}/settings`} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      {labels.settings}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {labels.signout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <LanguageSwitcher />
              <Button asChild variant="ghost">
                <Link href={`/${lang}/login`}>{labels.login}</Link>
              </Button>
              <Button asChild>
                <Link href={`/${lang}/signup`}>{labels.signup}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
