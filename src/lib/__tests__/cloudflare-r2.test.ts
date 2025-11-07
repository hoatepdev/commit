import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  uploadToR2,
  getSignedUploadUrl,
  getSignedDownloadUrl,
} from '../cloudflare-r2';

// Mock AWS SDK
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(() => ({
    send: vi.fn(),
  })),
  PutObjectCommand: vi.fn(),
  GetObjectCommand: vi.fn(),
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi.fn((client, command, options) =>
    Promise.resolve('https://signed-url.example.com')
  ),
}));

describe('Cloudflare R2', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up environment variables
    process.env.R2_ACCOUNT_ID = 'test-account';
    process.env.R2_ACCESS_KEY_ID = 'test-key';
    process.env.R2_SECRET_ACCESS_KEY = 'test-secret';
    process.env.R2_BUCKET_NAME = 'test-bucket';
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL = 'https://public.example.com';
  });

  describe('uploadToR2', () => {
    it('uploads file and returns public URL', async () => {
      const buffer = Buffer.from('test file content');
      const key = 'test/file.jpg';
      const contentType = 'image/jpeg';

      const url = await uploadToR2(buffer, key, contentType);

      expect(url).toBe('https://public.example.com/test/file.jpg');
    });
  });

  describe('getSignedUploadUrl', () => {
    it('generates signed upload URL', async () => {
      const key = 'test/upload.jpg';
      const contentType = 'image/jpeg';

      const url = await getSignedUploadUrl(key, contentType);

      expect(url).toBe('https://signed-url.example.com');
    });
  });

  describe('getSignedDownloadUrl', () => {
    it('generates signed download URL', async () => {
      const key = 'test/download.jpg';

      const url = await getSignedDownloadUrl(key);

      expect(url).toBe('https://signed-url.example.com');
    });
  });
});
