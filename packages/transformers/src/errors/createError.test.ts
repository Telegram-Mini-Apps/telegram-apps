import { expect, it } from 'vitest';

import { createError } from './createError.js';
import { CustomError } from './CustomError.js';

it('should return instance of SDK error with specified type and message properties', () => {
  const error = createError('ERR_INVALID_VALUE', 'my message');
  expect(error).toBeInstanceOf(CustomError);
  expect(error.type).toBe('ERR_INVALID_VALUE');
  expect(error.message).toBe('my message');
});
