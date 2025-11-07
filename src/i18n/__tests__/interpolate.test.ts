import { describe, it, expect } from 'vitest';
import {
  interpolate,
  getPluralKey,
  formatNumber,
  formatCurrencyI18n,
  formatDateI18n,
  getNestedValue,
} from '../utils/interpolate';

describe('i18n Interpolation', () => {
  describe('interpolate', () => {
    it('replaces single variable', () => {
      const result = interpolate('Hello {{name}}', { name: 'John' });
      expect(result).toBe('Hello John');
    });

    it('replaces multiple variables', () => {
      const result = interpolate(
        '{{greeting}} {{name}}, you have {{count}} messages',
        {
          greeting: 'Hello',
          name: 'Alice',
          count: 5,
        }
      );
      expect(result).toBe('Hello Alice, you have 5 messages');
    });

    it('handles missing params', () => {
      const result = interpolate('Hello {{name}}');
      expect(result).toBe('Hello {{name}}');
    });

    it('handles number values', () => {
      const result = interpolate('Price: {{price}}', { price: 100 });
      expect(result).toBe('Price: 100');
    });
  });

  describe('getPluralKey', () => {
    const translations = {
      item: '{{count}} item',
      item_plural: '{{count}} items',
    };

    it('returns singular form for count=1', () => {
      const result = getPluralKey('item', 1, translations);
      expect(result).toBe('{{count}} item');
    });

    it('returns plural form for count>1', () => {
      const result = getPluralKey('item', 5, translations);
      expect(result).toBe('{{count}} items');
    });

    it('returns plural form for count=0', () => {
      const result = getPluralKey('item', 0, translations);
      expect(result).toBe('{{count}} items');
    });
  });

  describe('formatNumber', () => {
    it('formats number in English', () => {
      const result = formatNumber(1234.56, 'en');
      expect(result).toBe('1,234.56');
    });

    it('formats number in Vietnamese', () => {
      const result = formatNumber(1234.56, 'vi');
      expect(result).toBe('1.234,56');
    });

    it('formats with custom options', () => {
      const result = formatNumber(0.5, 'en', { style: 'percent' });
      expect(result).toBe('50%');
    });
  });

  describe('formatCurrencyI18n', () => {
    it('formats VND currency', () => {
      const result = formatCurrencyI18n(100000, 'vi', 'VND');
      expect(result).toContain('100.000');
    });

    it('formats USD currency', () => {
      const result = formatCurrencyI18n(100, 'en', 'USD');
      expect(result).toContain('$100');
    });
  });

  describe('formatDateI18n', () => {
    it('formats date in English', () => {
      const date = new Date('2025-01-15');
      const result = formatDateI18n(date, 'en');
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });

    it('formats date in Vietnamese', () => {
      const date = new Date('2025-01-15');
      const result = formatDateI18n(date, 'vi');
      expect(result).toContain('2025');
    });

    it('accepts string date', () => {
      const result = formatDateI18n('2025-01-15', 'en');
      expect(result).toBeTruthy();
    });
  });

  describe('getNestedValue', () => {
    const obj = {
      app: {
        name: 'Commit.vn',
        tagline: 'Achieve Goals',
      },
      nav: {
        home: 'Home',
      },
    };

    it('gets nested value', () => {
      const result = getNestedValue(obj, 'app.name');
      expect(result).toBe('Commit.vn');
    });

    it('gets deeply nested value', () => {
      const result = getNestedValue(obj, 'nav.home');
      expect(result).toBe('Home');
    });

    it('returns undefined for missing key', () => {
      const result = getNestedValue(obj, 'app.missing');
      expect(result).toBeUndefined();
    });
  });
});
