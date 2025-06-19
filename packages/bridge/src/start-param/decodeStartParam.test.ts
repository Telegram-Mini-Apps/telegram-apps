import { it, expect } from 'vitest';

import { decodeStartParam } from './decodeStartParam.js';

it('should properly decode ASCII value', () => {
  expect(decodeStartParam('QUJDREVG')).toBe('ABCDEF');
});

it('should properly decode Unicode value', () => {
  expect(decodeStartParam('0KLQtdC70LXQs9GA0LDQvA==')).toBe('Телеграм');
});