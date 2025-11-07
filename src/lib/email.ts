import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSquadInvitation(
  toEmail: string,
  challengeTitle: string,
  inviterName: string,
  challengeId: string
) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: toEmail,
      subject: `You've been invited to join "${challengeTitle}" on Commit.vn`,
      html: `
        <h2>You've been invited to be an accountability partner!</h2>
        <p><strong>${inviterName}</strong> has invited you to join their challenge: <strong>${challengeTitle}</strong></p>
        <p>As an accountability partner, you'll:</p>
        <ul>
          <li>Help verify their progress by reviewing proof submissions</li>
          <li>Receive a share of the stake if they don't complete the challenge</li>
          <li>Support them in achieving their goals</li>
        </ul>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/challenges/${challengeId}/squad-invite"
             style="background-color: #2B5561; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
            Accept Invitation
          </a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 32px;">
          Don't have an account? You'll be able to create one when you accept the invitation.
        </p>
      `,
    });
  } catch (error) {
    console.error('Failed to send squad invitation:', error);
    throw error;
  }
}

export async function sendProofSubmittedNotification(
  toEmail: string,
  challengeTitle: string,
  challengeId: string
) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: toEmail,
      subject: `New proof submitted for "${challengeTitle}"`,
      html: `
        <h2>New Proof Submitted</h2>
        <p>A new proof has been submitted for the challenge: <strong>${challengeTitle}</strong></p>
        <p>Please review and verify the submission.</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/challenges/${challengeId}"
             style="background-color: #2B5561; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
            Review Proof
          </a>
        </p>
      `,
    });
  } catch (error) {
    console.error('Failed to send proof notification:', error);
    throw error;
  }
}

export async function sendChallengeCompletedEmail(
  toEmail: string,
  challengeTitle: string,
  success: boolean,
  amount: number
) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: toEmail,
      subject: success
        ? `Congratulations! You completed "${challengeTitle}"`
        : `Challenge "${challengeTitle}" has ended`,
      html: success
        ? `
        <h2>Congratulations! 🎉</h2>
        <p>You've successfully completed your challenge: <strong>${challengeTitle}</strong></p>
        <p>Your stake of <strong>${amount.toLocaleString('vi-VN')} VND</strong> will be refunded to you shortly.</p>
        <p>Keep up the great work and consider creating a new challenge to continue your momentum!</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background-color: #2B5561; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
            View Dashboard
          </a>
        </p>
      `
        : `
        <h2>Challenge Ended</h2>
        <p>Unfortunately, you didn't complete the challenge: <strong>${challengeTitle}</strong></p>
        <p>Your stake has been distributed among your accountability squad.</p>
        <p>Don't give up! Learn from this experience and try again with a new challenge.</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background-color: #2B5561; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
            Create New Challenge
          </a>
        </p>
      `,
    });
  } catch (error) {
    console.error('Failed to send challenge completion email:', error);
    throw error;
  }
}
