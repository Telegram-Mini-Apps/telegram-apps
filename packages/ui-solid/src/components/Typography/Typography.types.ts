import type { JSX } from 'solid-js';

import type { WithComponentProps } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { WithComponentProp } from '~/types/components.js';
import type { RequiredBy } from '~/types/utils.js';

export type TypographyType =
  | 'large-title'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'text'
  | 'subheadline1'
  | 'subheadline2'
  | 'caption1'
  | 'caption2';

export type TypographyComponent = keyof JSX.IntrinsicElements;

export type TypographyWeight = 'regular' | 'semibold' | 'bold';

/**
 * List of component element keys allowed to be modified.
 */
export type TypographyElementKey = 'root';

/**
 * List of components properties, which have defaults.
 */
export interface TypographyPropsDefaults extends WithComponentProps {
  /**
   * Typography type.
   * @default 'text'
   */
  type?: TypographyType;
  /**
   * Font weight.
   * @default 'regular'
   */
  weight?: TypographyWeight;
  /**
   * Should component use monospace font.
   * @default false
   */
  monospace?: boolean;
}

/**
 * Properties passed to the Typography component class names computers.
 */
export interface TypographyClassesProps
  extends RequiredBy<TypographyProps, keyof TypographyPropsDefaults> {
}

/**
 * Typography component properties.
 */
export type TypographyProps<Component extends TypographyComponent = 'p'> =
  TypographyPropsDefaults
  & WithOptionalClasses<TypographyElementKey, TypographyClassesProps>
  & WithComponentProp<Component, 'p'>;
