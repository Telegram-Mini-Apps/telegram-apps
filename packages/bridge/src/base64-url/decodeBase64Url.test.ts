import { describe, expect, it } from 'vitest';

import { decodeBase64Url } from './decodeBase64Url.js';

describe('decodeBase64Url', () => {
  it('should properly decode ASCII value', () => {
    expect(decodeBase64Url('QUJDREVG')).toBe('ABCDEF');
  });

  it('should properly decode Unicode value', () => {
    expect(decodeBase64Url('0KLQtdC70LXQs9GA0LDQvA==')).toBe('Телеграм');
  });
});
