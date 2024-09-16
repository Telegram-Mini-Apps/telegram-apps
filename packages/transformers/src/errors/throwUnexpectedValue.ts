import { TypedError } from '@telegram-apps/toolkit';

import { ERR_UNEXPECTED_TYPE } from './errors.js';

export function throwUnexpectedValue(value: unknown): never {
  throw new TypedError(ERR_UNEXPECTED_TYPE, `Unexpected value received: ${JSON.stringify(value)}`);
}