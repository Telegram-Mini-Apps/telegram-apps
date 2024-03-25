import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { WithConfig } from '~/types/known.js';

import type { WithOptionalClasses } from '~/styles/types.js';

/**
 * Progress component element keys allowed to be customized.
 */
export type ProgressElementKey = 'root';

/**
 * Progress component public properties.
 */
export interface ProgressProps
  extends WithConfig,
    JSXIntrinsicElementAttrs<'progress'>,
    WithOptionalClasses<ProgressElementKey, ProgressClassesProps> {
}

/**
 * Progress component properties passed to the classes hooks.
 */
export interface ProgressClassesProps extends ProgressProps {
}
