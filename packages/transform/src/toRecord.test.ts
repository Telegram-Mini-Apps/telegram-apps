import { expect, it } from 'vitest';

import { toRecord } from './toRecord.js';

it('should throw an error in case, passed value is not JSON object or not JSON object converted to string', () => {
  expect(() => toRecord('')).toThrow();
  expect(() => toRecord(true)).toThrow();
  expect(() => toRecord('{}')).not.toThrow();
  expect(() => toRecord({})).not.toThrow();
});
