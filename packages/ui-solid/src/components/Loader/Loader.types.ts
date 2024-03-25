import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { WithConfig } from '~/types/known.js';
import type { RequiredBy } from '~/types/utils.js';

import type { WithOptionalClasses } from '~/styles/types.js';

/**
 * Component properties, having defaults.
 */
export interface LoaderDefaults {
  /**
   * Loader size.
   * @default 'md'
   */
  size?: LoaderSize;
}

/**
 * Loader size.
 */
export type LoaderSize = 'sm' | 'md' | 'lg';

/**
 * List of component element keys allowed to be modified.
 */
export type LoaderElementKey =
  | 'root'
  | 'iosLine'
  | 'androidContainer'
  | 'androidCircle';

/**
 * Loader component public properties.
 */
export interface LoaderProps extends JSXIntrinsicElementAttrs<'div'>,
  WithOptionalClasses<LoaderElementKey, LoaderClassesProps>,
  WithConfig,
  LoaderDefaults {
}

/**
 * Loader component properties passed to the classes hooks.
 */
export interface LoaderClassesProps extends RequiredBy<LoaderProps, keyof LoaderDefaults> {
}
