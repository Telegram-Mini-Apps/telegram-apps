import { it, expect } from 'vitest';

import { decodeBase64Url } from './decodeBase64Url.js';

it('should properly decode ASCII value', () => {
  expect(decodeBase64Url('QUJDREVG')).toBe('ABCDEF');
});

it('should properly decode Unicode value', () => {
  expect(decodeBase64Url('0KLQtdC70LXQs9GA0LDQvA==')).toBe('Телеграм');
});