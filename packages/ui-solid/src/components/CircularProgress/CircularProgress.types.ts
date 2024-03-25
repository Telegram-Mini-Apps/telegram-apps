import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { WithConfig } from '~/types/known.js';
import type { RequiredBy } from '~/types/utils.js';

import type { WithOptionalClasses } from '~/styles/types.js';

/**
 * Allowed component size.
 */
export type CircularProgressSize = 'sm' | 'md' | 'lg';

/**
 * CircularProgress component element keys allowed to be customized.
 */
export type CircularProgressElementKey = 'root' | 'background' | 'fill';

/**
 * Component properties, having defaults.
 */
export interface CircularProgressDefaults {
  /**
   * Component size.
   * @default 'md'
   */
  size?: CircularProgressSize;
  /**
   * Current progress value.
   * @default 0
   */
  value?: number;
  /**
   * Maximum progress value. This value must be positive.
   * @default 1
   */
  max?: number;
}

/**
 * CircularProgress component public properties.
 */
export interface CircularProgressProps
  extends JSXIntrinsicElementAttrs<'svg'>,
    WithConfig,
    CircularProgressDefaults,
    WithOptionalClasses<CircularProgressElementKey, CircularProgressClassesProps> {
}

/**
 * CircularProgress component properties passed to the classes hooks.
 */
export interface CircularProgressClassesProps
  extends RequiredBy<CircularProgressProps, keyof CircularProgressDefaults> {
}
