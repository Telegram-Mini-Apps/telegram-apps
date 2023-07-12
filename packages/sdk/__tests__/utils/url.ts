import { describe, expect, it } from '@jest/globals';
import { formatURL } from '../../src/utils';

describe('utils', () => {
  describe('url.ts', () => {
    describe('formatURL', () => {
      it('should convert URL to its form', () => {
        expect(formatURL('tg')).toBe('http://localhost/tg');
        expect(formatURL('https://domain.com/')).toBe('https://domain.com/');
        expect(formatURL('//domain.com')).toBe('http://domain.com/');
      });

      it('should throw an error in case, URL protocol '
        + 'different from "http" not "https"', () => {
        expect(() => formatURL('fs://telegram.org')).toThrow(
          'URL protocol is not supported by OS, or link has '
          + 'not allowed protocol: fs',
        );
        expect(() => formatURL('https://telegram.org')).not.toThrow();
      });
    });
  });
});
