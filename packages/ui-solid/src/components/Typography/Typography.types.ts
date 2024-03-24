import type { Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { RequiredBy } from '~/types/utils.js';

import type { WithOptionalClasses } from '~/styles/types.js';

import type { WithConfig } from '~/components/types.js';

/**
 * Component properties, having defaults.
 */
interface WithDefaults {
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
 * Properties passed to the Typography children in case, it represents a component.
 */
export interface TypographyComponentProps {
  class?: string;
}

/**
 * Typography.Custom component properties.
 */
export interface TypographyCustomProps
  extends WithConfig,
    WithDefaults,
    WithOptionalClasses<TypographyElementKey, TypographyCustomClassesProps> {
  /**
   * Component which should be rendered by the Typography component.
   */
  component: Component<TypographyComponentProps>;
  class?: string;
}

/**
 * Typography.Custom component properties passed to the classes hooks.
 */
export interface TypographyCustomClassesProps
  extends RequiredBy<TypographyCustomProps, keyof WithDefaults> {

}

/**
 * Typography component public properties.
 */
export interface TypographyProps
  extends JSXIntrinsicElementAttrs<'p'>,
    WithConfig,
    WithDefaults,
    WithOptionalClasses<TypographyElementKey, TypographyClassesProps> {
}

/**
 * Typography component properties passed to the classes hooks.
 */
export interface TypographyClassesProps extends RequiredBy<TypographyProps, keyof WithDefaults> {
}
