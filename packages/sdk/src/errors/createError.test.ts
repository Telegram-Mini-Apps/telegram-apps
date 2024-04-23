import { expect, it } from 'vitest';

import { createError } from '@/errors/createError.js';
import { ERROR_METHOD_UNSUPPORTED } from '@/errors/errors.js';
import { SDKError } from '@/errors/SDKError.js';

it('should return instance of SDK error with specified type and message properties', () => {
  const error = createError(ERROR_METHOD_UNSUPPORTED, 'my message');
  expect(error).toBeInstanceOf(SDKError);
  expect(error.type).toBe(ERROR_METHOD_UNSUPPORTED);
  expect(error.message).toBe('my message');
});
