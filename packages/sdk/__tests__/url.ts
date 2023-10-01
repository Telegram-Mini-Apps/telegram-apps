import { describe, expect, it } from 'vitest';

import { formatURL } from '../src/index.js';

describe('url.ts', () => {
  describe('formatURL', () => {
    it('should convert URL to its form', () => {
      const { origin, pathname, protocol } = window.location;
      expect(formatURL('tg')).toBe(`${origin}${pathname}tg`);
      expect(formatURL('https://domain.com/')).toBe('https://domain.com/');
      expect(formatURL('//domain.com')).toBe(`${protocol}//domain.com/`);
    });

    it('should throw an error in case, URL protocol different from "http" not "https"', () => {
      expect(() => formatURL('fs://telegram.org')).toThrow(
        'URL protocol is not supported by OS, or link has '
        + 'not allowed protocol: fs',
      );
      expect(() => formatURL('https://telegram.org')).not.toThrow();
    });
  });
});
