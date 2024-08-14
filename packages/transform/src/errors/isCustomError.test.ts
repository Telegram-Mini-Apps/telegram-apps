import { expect, it } from 'vitest';

import { isCustomError } from './isCustomError.js';
import { CustomError } from './CustomError.js';

it('should return true if passed value is instance of CustomError', () => {
  expect(isCustomError('')).toBe(false);
  expect(isCustomError(new Error())).toBe(false);
  expect(isCustomError(new CustomError('ERR_METHOD_UNSUPPORTED'))).toBe(true);
});
