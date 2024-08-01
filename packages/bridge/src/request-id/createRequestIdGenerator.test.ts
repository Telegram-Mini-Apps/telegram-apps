import { expect, it } from 'vitest';

import { createRequestIdGenerator } from './createRequestIdGenerator.js';

it('should return function, which returns value higher by one than returned previously. Values returned are numeric strings, starting from 1', () => {
  const fn = createRequestIdGenerator();
  expect(fn()).toBe('1');
  expect(fn()).toBe('2');
  expect(fn()).toBe('3');
})