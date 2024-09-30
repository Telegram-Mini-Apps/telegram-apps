import { describe, expect, it } from 'vitest';

import { fn } from './fn.js';

it('should return value in case, it has type function. Throw error otherwise', () => {
  const f = () => {};
  expect(fn()(f)).toBe(f);
  expect(() => fn()('abc')).toThrow()
});

describe('optional', () => {
  it('should return undefined if value is undefined', () => {
    expect(fn(true)(undefined)).toBe(undefined);
  });
});
