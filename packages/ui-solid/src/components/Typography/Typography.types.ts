import type { WithComponentProps } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { WithComponentProp } from '~/types/components.js';

/**
 * Typography variant.
 */
export type TypographyVariant =
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

/**
 * HTML tags allowed to be used in the component.
 */
export type TypographyComponent =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'div'
  | 'span'
  | 'p'
  | 'label';

/**
 * Font weight.
 */
export type TypographyWeight = 'regular' | 'semibold' | 'bold';

/**
 * List of component element keys allowed to be customized.
 */
export type TypographyElementKey = 'root';

/**
 * List of components properties, which have defaults.
 */
export interface TypographyPropsDefaults extends WithComponentProps {
  /**
   * Should component use monospace font.
   * @default false
   */
  monospace?: boolean;
  /**
   * Typography variant.
   * @default 'text'
   */
  variant?: TypographyVariant;
  /**
   * Font weight.
   * @default 'regular'
   */
  weight?: TypographyWeight;
}

/**
 * Properties passed to the Typography component class names computers.
 */
export type TypographyClassesProps<Cmp extends TypographyComponent> =
  & Required<TypographyPropsDefaults>
  & WithComponentProp<Cmp, 'p'>;

/**
 * Typography component properties.
 */
export type TypographyProps<Cmp extends TypographyComponent> =
  & TypographyPropsDefaults
  & WithOptionalClasses<TypographyElementKey, TypographyClassesProps<Cmp>>
  & WithComponentProp<Cmp, 'p'>;
