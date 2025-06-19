import { expect, it } from 'vitest';

import { createStartParam } from '@/start-param/createStartParam.js';

it('should return value\'s base64 representation if its length is less than 513', () => {
  expect(createStartParam('ABCDEF')).toBe('QUJDREVG');
});

it('should throw if value\'s base64 representation length exceeds 512', () => {
  expect(() => createStartParam(new Array(385).fill('A').join(''))).toThrow('Value is too long for start parameter');
});