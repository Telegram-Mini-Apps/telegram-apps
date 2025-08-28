import { it, expect } from 'vitest';

import { encodeBase64Url } from './encodeBase64Url.js';

it('should properly encode ASCII value', () => {
  expect(encodeBase64Url('ABCDEF')).toBe('QUJDREVG');
});

it('should properly encode Unicode value', () => {
  expect(encodeBase64Url('Телеграм')).toBe('0KLQtdC70LXQs9GA0LDQvA==');
});
