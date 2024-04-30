import { describe, expect, it } from 'vitest';

import { keyToExternal, keyToLocal } from './keys.js';

describe('keyToLocal', () => {
  it('should replace _[a-z] with [A-Z]', () => {
    expect(keyToLocal('bg_color')).toBe('bgColor');
    expect(keyToLocal('secondary_bg_color')).toBe('secondaryBgColor');
    expect(keyToLocal('text_color')).toBe('textColor');
  });
});

describe('keyToExternal', () => {
  it('should replace [A-Z] with _[a-z]', () => {
    expect(keyToExternal('bgColor')).toBe('bg_color');
    expect(keyToExternal('secondaryBgColor')).toBe('secondary_bg_color');
    expect(keyToExternal('textColor')).toBe('text_color');
  });
});
