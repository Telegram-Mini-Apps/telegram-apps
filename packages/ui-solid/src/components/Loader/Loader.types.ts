import type { JSX } from 'solid-js';

import type { WithOptionalClasses } from '../../styles/index.js';
import type { RequiredBy } from '../../types/index.js';
import type { WithComponentProps } from '../types.js';

/**
 * Allowed loader size.
 */
export type LoaderSize = 'sm' | 'md' | 'lg';

/**
 * List of component element keys.
 */
export type LoaderElementKey = 'root' | 'inner';

/**
 * Properties, which are passed to classes resolvers.
 */
export interface LoaderClassesProps
  extends RequiredBy<LoaderViewProps, 'size' | keyof WithComponentProps> {
}

export interface LoaderViewProps extends JSX.HTMLAttributes<HTMLDivElement>,
  WithOptionalClasses<LoaderElementKey, LoaderClassesProps>,
  WithComponentProps {
  /**
   * Loader size.
   * @default 'md'
   */
  size?: LoaderSize;
}

export type LoaderProps = LoaderViewProps;
