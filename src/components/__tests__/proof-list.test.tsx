import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProofList } from '../proof-list';
import { Database } from '@/types/database.types';

type Proof = Database['public']['Tables']['proofs']['Row'];

describe('ProofList', () => {
  it('shows empty state when no proofs', () => {
    render(<ProofList proofs={[]} isCreator={true} />);
    expect(screen.getByText('No proofs submitted yet')).toBeInTheDocument();
  });

  it('renders proof items correctly', () => {
    const mockProofs: Proof[] = [
      {
        id: '1',
        challenge_id: 'challenge-1',
        user_id: 'user-1',
        media_url: 'https://example.com/image.jpg',
        media_type: 'image',
        caption: 'Gym session completed',
        proof_date: '2025-01-15',
        status: 'approved',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
      {
        id: '2',
        challenge_id: 'challenge-1',
        user_id: 'user-1',
        media_url: 'https://example.com/video.mp4',
        media_type: 'video',
        caption: null,
        proof_date: '2025-01-14',
        status: 'pending',
        created_at: '2025-01-14T10:00:00Z',
        updated_at: '2025-01-14T10:00:00Z',
      },
    ];

    render(<ProofList proofs={mockProofs} isCreator={true} />);

    expect(screen.getByText('Gym session completed')).toBeInTheDocument();
    expect(screen.getByText(/15 tháng 1, 2025/i)).toBeInTheDocument();
    expect(screen.getByText('approved')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('shows View Media button for all proofs', () => {
    const mockProofs: Proof[] = [
      {
        id: '1',
        challenge_id: 'challenge-1',
        user_id: 'user-1',
        media_url: 'https://example.com/image.jpg',
        media_type: 'image',
        caption: 'Test',
        proof_date: '2025-01-15',
        status: 'pending',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
    ];

    render(<ProofList proofs={mockProofs} isCreator={false} />);
    expect(screen.getByText('View Media')).toBeInTheDocument();
  });

  it('shows Challenge button for squad members on pending proofs', () => {
    const mockProofs: Proof[] = [
      {
        id: '1',
        challenge_id: 'challenge-1',
        user_id: 'user-1',
        media_url: 'https://example.com/image.jpg',
        media_type: 'image',
        caption: null,
        proof_date: '2025-01-15',
        status: 'pending',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
    ];

    render(<ProofList proofs={mockProofs} isCreator={false} />);
    expect(screen.getByText('Challenge')).toBeInTheDocument();
  });

  it('does not show Challenge button for creators', () => {
    const mockProofs: Proof[] = [
      {
        id: '1',
        challenge_id: 'challenge-1',
        user_id: 'user-1',
        media_url: 'https://example.com/image.jpg',
        media_type: 'image',
        caption: null,
        proof_date: '2025-01-15',
        status: 'pending',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
    ];

    render(<ProofList proofs={mockProofs} isCreator={true} />);
    expect(screen.queryByText('Challenge')).not.toBeInTheDocument();
  });

  it('renders correct icon for image type', () => {
    const mockProofs: Proof[] = [
      {
        id: '1',
        challenge_id: 'challenge-1',
        user_id: 'user-1',
        media_url: 'https://example.com/image.jpg',
        media_type: 'image',
        caption: null,
        proof_date: '2025-01-15',
        status: 'pending',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
    ];

    const { container } = render(
      <ProofList proofs={mockProofs} isCreator={true} />
    );
    // Check for SVG icon presence
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
