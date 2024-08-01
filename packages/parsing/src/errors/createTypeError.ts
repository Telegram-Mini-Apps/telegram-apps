import { createError } from './createError.js';
import { ERR_UNEXPECTED_TYPE } from './errors.js';
import { CustomError } from './CustomError.js';

export function createTypeError(): CustomError {
  return createError(ERR_UNEXPECTED_TYPE);
}