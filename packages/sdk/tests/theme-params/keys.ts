import { describe, expect, it } from 'vitest';

import { keyToExternal, keyToLocal } from '~/theme-params/keys.js';

describe('keyToLocal', () => {
  it('should replace "^bg" and "_bg" with "background" and "_background". Then replace _[a-z] with [A-Z]', () => {
    expect(keyToLocal('bg_color')).toBe('backgroundColor');
    expect(keyToLocal('secondary_bg_color')).toBe('secondaryBackgroundColor');
    expect(keyToLocal('text_color')).toBe('textColor');
  });
});

describe('keyToExternal', () => {
  it('should replace [A-Z] with _[a-z]. Then replace "background" and "_background" with "^bg" and "_bg"', () => {
    expect(keyToExternal('backgroundColor')).toBe('bg_color');
    expect(keyToExternal('secondaryBackgroundColor')).toBe('secondary_bg_color');
    expect(keyToExternal('textColor')).toBe('text_color');
  });
});
