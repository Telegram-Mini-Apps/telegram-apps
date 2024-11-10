import { TypedError } from '@telegram-apps/bridge';

import { ERR_CSS_VARS_ALREADY_BOUND } from '@/errors.js';

/**
 * @throws {TypedError} ERR_CSS_VARS_ALREADY_BOUND
 */
export function throwCssVarsBound(): never {
  throw new TypedError(
    ERR_CSS_VARS_ALREADY_BOUND,
    'CSS variables are already bound',
  );
}