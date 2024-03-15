import type { JSX } from 'solid-js';

import type { WithComponentProps } from '~components/types.js';
import type { WithOptionalClasses } from '~styles/types.js';
import type { RequiredBy } from '~types/utils.js';

/**
 * Allowed loader size.
 */
export type LoaderSize = 'sm' | 'md' | 'lg';

/**
 * List of component element keys.
 */
export type LoaderElementKey =
  | 'root'
  | 'iosLine'
  | 'androidContainer'
  | 'androidCircle';

/**
 * List of components properties, which have defaults.
 */
export interface LoaderPropsDefaults extends WithComponentProps {
  /**
   * Loader size.
   * @default 'md'
   */
  size?: LoaderSize;
}

/**
 * Properties, which are passed to classes resolvers.
 */
export interface LoaderClassesProps extends RequiredBy<LoaderProps, keyof LoaderPropsDefaults> {
}

export interface LoaderProps extends JSX.HTMLAttributes<HTMLDivElement>,
  WithOptionalClasses<LoaderElementKey, LoaderClassesProps>,
  LoaderPropsDefaults {
}
