import {describe, expect, it} from '@jest/globals';
import {formatURL} from './url';

describe('utils', () => {
  describe('url', () => {
    it('should convert URL to its form', () => {
      expect(formatURL('tg')).toBe('http://localhost/tg');
    });

    it('should throw an error in case, URL protocol is nor http and not https', () => {
      expect(() => formatURL('fs://telegram.org')).toThrow();
      expect(() => formatURL('https://telegram.org')).not.toThrow();
    });
  })
})