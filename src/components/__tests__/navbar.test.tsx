import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navbar } from '../navbar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}));

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    signOut: vi.fn(),
  },
};

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logo and brand name', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getByText('Commit.vn')).toBeInTheDocument();
    });
  });

  it('shows login and signup buttons when not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });
  });

  it('shows dashboard and new challenge buttons when authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'test@example.com',
          user_metadata: {
            full_name: 'Test User',
          },
        },
      },
    });

    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('New Challenge')).toBeInTheDocument();
    });
  });

  it('does not render on auth pages', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/login');

    const { container } = render(<Navbar />);
    expect(container.firstChild).toBeNull();
  });
});
