import type { JSXIntrinsicElement, JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { WithConfig } from '~/types/known.js';
import type { PartialBy, RequiredBy } from '~/types/utils.js';

import type { WithOptionalClasses } from '~/styles/types.js';

type IntrinsicProps<Element extends JSXIntrinsicElement> =
  & WithConfig
  & TypographyDefaults
  & { component: Element }
  & { [K in keyof JSXIntrinsicElementAttrs<Element>]: JSXIntrinsicElementAttrs<Element>[K] };

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
 * Typography font weight.
 */
export type TypographyWeight = 'regular' | 'semibold' | 'bold';

/**
 * Typography component element keys allowed to be customized.
 */
export type TypographyElementKey = 'root';

/**
 * Component properties, having defaults.
 */
export interface TypographyDefaults {
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
  /**
   * HTML tag to use as a root element.
   * @default 'p'
   */
  component?: JSXIntrinsicElement;
}

/**
 * Properties of the component in case custom property "component" was passed.
 */
export type TypographyIntrinsicProps<Element extends JSXIntrinsicElement> =
  & IntrinsicProps<Element>
  & (
  WithOptionalClasses<
    TypographyElementKey,
    RequiredBy<IntrinsicProps<Element>, keyof TypographyDefaults>
  >
  );

/**
 * Typography component default properties.
 */
export interface TypographyProps extends PartialBy<TypographyIntrinsicProps<'p'>, 'component'> {}

/**
 * Typography component properties passed to the classes hooks.
 */
export interface TypographyClassesProps
  extends RequiredBy<TypographyProps, keyof TypographyDefaults> {
}
