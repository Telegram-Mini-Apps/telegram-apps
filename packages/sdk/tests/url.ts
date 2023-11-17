import { describe, expect, it } from 'vitest';

import { formatURL } from '../src/index.js';

describe('url.ts', () => {
  describe('formatURL', () => {
    it('should convert URL to its full form', () => {
      const { origin, pathname, protocol } = window.location;
      expect(formatURL('tg')).toBe(`${origin}${pathname}tg`);
      expect(formatURL('https://domain.com/')).toBe('https://domain.com/');
      expect(formatURL('//domain.com')).toBe(`${protocol}//domain.com/`);
    });
  });
});
