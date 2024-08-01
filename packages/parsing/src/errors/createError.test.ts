import { expect, it } from 'vitest';

import { createError } from './createError.js';
import { ERR_METHOD_UNSUPPORTED } from './errors.js';
import { CustomError } from './CustomError.js';

it('should return instance of SDK error with specified type and message properties', () => {
  const error = createError(ERR_METHOD_UNSUPPORTED, 'my message');
  expect(error).toBeInstanceOf(CustomError);
  expect(error.type).toBe(ERR_METHOD_UNSUPPORTED);
  expect(error.message).toBe('my message');
});
