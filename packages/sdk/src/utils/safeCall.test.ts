import { expect, it } from 'vitest';
import { safeCall } from '@/utils/safeCall.js';

it('should return object with "result" equal to execution result', () => {
  expect(safeCall(() => 123)).toStrictEqual([true, 123]);
});

it('should return object with "error" equal to thrown error', () => {
  expect(safeCall(() => {
    throw new Error('error');
  })).toStrictEqual([false, new Error('error')]);
});