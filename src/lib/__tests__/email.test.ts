import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sendSquadInvitation,
  sendProofSubmittedNotification,
  sendChallengeCompletedEmail,
} from '../email';

// Mock Resend
const mockSend = vi.fn();
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: mockSend,
    },
  })),
}));

describe('Email Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ id: 'test-email-id' });

    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_FROM_EMAIL = 'test@commit.vn';
    process.env.NEXT_PUBLIC_APP_URL = 'https://commit.vn';
  });

  describe('sendSquadInvitation', () => {
    it('sends invitation email with correct parameters', async () => {
      await sendSquadInvitation(
        'friend@example.com',
        'Go to gym 3x/week',
        'John Doe',
        'challenge-123'
      );

      expect(mockSend).toHaveBeenCalledWith({
        from: 'test@commit.vn',
        to: 'friend@example.com',
        subject: expect.stringContaining('Go to gym 3x/week'),
        html: expect.stringContaining('John Doe'),
      });
    });

    it('includes challenge link in email', async () => {
      await sendSquadInvitation(
        'friend@example.com',
        'Challenge Title',
        'Sender',
        'challenge-456'
      );

      const emailCall = mockSend.mock.calls[0][0];
      expect(emailCall.html).toContain(
        'https://commit.vn/challenges/challenge-456'
      );
    });

    it('throws error on failure', async () => {
      mockSend.mockRejectedValue(new Error('Send failed'));

      await expect(
        sendSquadInvitation('test@example.com', 'Title', 'Sender', 'id')
      ).rejects.toThrow('Send failed');
    });
  });

  describe('sendProofSubmittedNotification', () => {
    it('sends notification with correct parameters', async () => {
      await sendProofSubmittedNotification(
        'squad@example.com',
        'Daily workout challenge',
        'challenge-789'
      );

      expect(mockSend).toHaveBeenCalledWith({
        from: 'test@commit.vn',
        to: 'squad@example.com',
        subject: expect.stringContaining('Daily workout challenge'),
        html: expect.stringContaining('new proof'),
      });
    });

    it('includes review link', async () => {
      await sendProofSubmittedNotification(
        'squad@example.com',
        'Challenge',
        'challenge-123'
      );

      const emailCall = mockSend.mock.calls[0][0];
      expect(emailCall.html).toContain(
        'https://commit.vn/challenges/challenge-123'
      );
    });
  });

  describe('sendChallengeCompletedEmail', () => {
    it('sends success email when challenge completed', async () => {
      await sendChallengeCompletedEmail(
        'user@example.com',
        'Gym Challenge',
        true,
        100000
      );

      expect(mockSend).toHaveBeenCalledWith({
        from: 'test@commit.vn',
        to: 'user@example.com',
        subject: expect.stringContaining('Congratulations'),
        html: expect.stringContaining('successfully completed'),
      });
    });

    it('sends failure email when challenge not completed', async () => {
      await sendChallengeCompletedEmail(
        'user@example.com',
        'Gym Challenge',
        false,
        100000
      );

      expect(mockSend).toHaveBeenCalledWith({
        from: 'test@commit.vn',
        to: 'user@example.com',
        subject: expect.stringContaining('ended'),
        html: expect.stringContaining("didn't complete"),
      });
    });

    it('includes amount in success email', async () => {
      await sendChallengeCompletedEmail(
        'user@example.com',
        'Challenge',
        true,
        250000
      );

      const emailCall = mockSend.mock.calls[0][0];
      expect(emailCall.html).toContain('250');
    });
  });
});
