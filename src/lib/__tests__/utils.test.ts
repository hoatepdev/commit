import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate, getDaysRemaining } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
    });

    it('handles conditional classes', () => {
      expect(cn('px-4', false && 'hidden', 'py-2')).toBe('px-4 py-2');
    });

    it('merges tailwind classes correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });

    it('handles undefined and null', () => {
      expect(cn('px-4', undefined, null, 'py-2')).toBe('px-4 py-2');
    });
  });

  describe('formatCurrency', () => {
    it('formats VND correctly', () => {
      expect(formatCurrency(100000)).toBe('₫100.000');
    });

    it('handles large amounts', () => {
      expect(formatCurrency(10000000)).toBe('₫10.000.000');
    });

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('₫0');
    });

    it('handles decimal amounts', () => {
      const result = formatCurrency(100000.5);
      expect(result).toContain('100.000');
    });
  });

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const date = '2025-01-15';
      const result = formatDate(date);
      expect(result).toContain('2025');
      expect(result).toContain('1');
      expect(result).toContain('15');
    });

    it('formats Date object correctly', () => {
      const date = new Date('2025-01-15');
      const result = formatDate(date);
      expect(result).toContain('2025');
    });

    it('handles different locales', () => {
      const date = '2025-12-31';
      const result = formatDate(date);
      expect(result).toBeTruthy();
    });
  });

  describe('getDaysRemaining', () => {
    it('calculates days remaining correctly', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(getDaysRemaining(tomorrow)).toBe(1);
    });

    it('handles past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(getDaysRemaining(yesterday)).toBeLessThan(0);
    });

    it('handles date strings', () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);
      expect(getDaysRemaining(future.toISOString())).toBe(7);
    });

    it('handles same day', () => {
      const today = new Date();
      const result = getDaysRemaining(today);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
  });
});
