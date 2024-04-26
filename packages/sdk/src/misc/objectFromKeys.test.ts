import { expect, it } from 'vitest';

import { objectFromKeys } from '@/misc/objectFromKeys.js';

it('should create with specified keys and value', () => {
  expect(objectFromKeys(['a', 'b', 'c'], 'value')).toStrictEqual({
    a: 'value',
    b: 'value',
    c: 'value',
  });

  const fn = () => null;
  expect(objectFromKeys(['a', 'b', 'c'], fn)).toStrictEqual({
    a: fn,
    b: fn,
    c: fn,
  });
});
