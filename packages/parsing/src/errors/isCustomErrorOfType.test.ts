import { expect, it } from 'vitest';

import { isCustomErrorOfType } from './isCustomErrorOfType.js';
import { CustomError } from './CustomError.js';

it('should return true if passed value is instance of CustomError', () => {
  expect(isCustomErrorOfType('', 'ERR_METHOD_UNSUPPORTED')).toBe(false);
  expect(isCustomErrorOfType(new Error(), 'ERR_METHOD_UNSUPPORTED')).toBe(false);
  expect(isCustomErrorOfType(new CustomError('ERR_METHOD_UNSUPPORTED'), 'ERR_METHOD_UNSUPPORTED')).toBe(true);
});
