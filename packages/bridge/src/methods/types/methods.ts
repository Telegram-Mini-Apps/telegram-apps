import type { If, IsNever } from '@telegram-apps/toolkit';

import type { Methods61 } from './6.1.js';
import type { Methods60 } from './6.0.js';
import type { Methods62 } from './6.2.js';
import type { Methods78 } from './7.8.js';
import type { Methods64 } from './6.4.js';
import type { Methods67 } from './6.7.js';
import type { Methods69 } from './6.9.js';
import type { Methods610 } from './6.10.js';
import type { Methods72 } from './7.2.js';
import type { Methods77 } from './7.7.js';

/**
 * Describes a list of events and their parameters that could be posted.
 * @see https://docs.telegram-mini-apps.com/platform/methods
 */
export interface Methods
  extends Methods60,
    Methods61,
    Methods62,
    Methods64,
    Methods67,
    Methods69,
    Methods610,
    Methods72,
    Methods77,
    Methods78 {
}

/**
 * Mini Apps method name.
 */
export type MethodName = keyof Methods;

/**
 * Parameters of the specified Mini Apps method.
 */
export type MethodParams<M extends MethodName> = Methods[M]['params'];

/**
 * Methods with optional parameters.
 */
export type MethodNameWithOptionalParams = {
  [M in MethodName]: undefined extends MethodParams<M>
    ? M
    : never;
}[MethodName];

/**
 * Methods without parameters.
 */
export type MethodNameWithoutParams = {
  [M in MethodName]: If<IsNever<MethodParams<M>>, M, never>;
}[MethodName];

/**
 * Methods with parameters.
 */
export type MethodNameWithRequiredParams = Exclude<
  MethodName,
  MethodNameWithoutParams | MethodNameWithOptionalParams
>;

/**
 * Method names which have versioned params.
 */
export type MethodNameWithVersionedParams = {
  [M in MethodName]: If<IsNever<Methods[M]['versionedParams']>, never, M>;
}[MethodName];

/**
 * Method parameters which appear only in the specific Telegram Mini Apps version.
 */
export type MethodVersionedParams<M extends MethodNameWithVersionedParams> =
  Methods[M]['versionedParams'];
