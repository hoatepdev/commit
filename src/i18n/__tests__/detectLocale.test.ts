import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  detectLocale,
  saveLocalePreference,
  getStoredLocale,
} from '../utils/detectLocale';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Locale Detection', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('detectLocale', () => {
    it('returns default locale when no preferences', () => {
      const result = detectLocale();
      expect(result).toBe('en');
    });

    it('detects locale from URL', () => {
      const request = new Request('http://localhost:3000/vi/dashboard');
      const result = detectLocale(request);
      expect(result).toBe('vi');
    });

    it('falls back to default for invalid locale', () => {
      const request = new Request('http://localhost:3000/invalid/page');
      const result = detectLocale(request);
      expect(result).toBe('en');
    });
  });

  describe('saveLocalePreference', () => {
    it('saves locale to localStorage', () => {
      saveLocalePreference('vi');
      expect(localStorageMock.getItem('camket-locale')).toBe('vi');
    });

    it('overwrites previous value', () => {
      saveLocalePreference('vi');
      saveLocalePreference('en');
      expect(localStorageMock.getItem('camket-locale')).toBe('en');
    });
  });

  describe('getStoredLocale', () => {
    it('returns null when no stored locale', () => {
      const result = getStoredLocale();
      expect(result).toBeNull();
    });

    it('returns stored locale', () => {
      localStorageMock.setItem('camket-locale', 'vi');
      const result = getStoredLocale();
      expect(result).toBe('vi');
    });

    it('returns null for invalid stored locale', () => {
      localStorageMock.setItem('camket-locale', 'invalid');
      const result = getStoredLocale();
      expect(result).toBeNull();
    });
  });
});
