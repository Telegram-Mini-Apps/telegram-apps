import { TypedError } from '@telegram-apps/bridge';

import { ERR_VARS_ALREADY_BOUND } from '@/errors.js';

/**
 * @throws {TypedError}
 */
export function throwCssVarsBound(): never {
  throw new TypedError(
    ERR_VARS_ALREADY_BOUND,
    'CSS variables are already bound',
  );
}