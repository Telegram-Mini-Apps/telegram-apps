import type { Component } from 'solid-js';

import type { WithConfig } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { JSXElement, JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { RequiredBy } from '~/types/utils.js';

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
export interface TypographyChildrenProps {
  class?: string;
}

/**
 * Typography component public properties.
 */
export interface TypographyProps
  extends Omit<JSXIntrinsicElementAttrs<'p'>, 'children'>,
    WithConfig,
    WithDefaults,
    WithOptionalClasses<TypographyElementKey, TypographyProps> {
  children?: JSXElement | Component<TypographyChildrenProps>;
}

/**
 * Typography component properties passed to the classes hooks.
 */
export type TypographyClassesProps = RequiredBy<TypographyProps, keyof WithDefaults>;
