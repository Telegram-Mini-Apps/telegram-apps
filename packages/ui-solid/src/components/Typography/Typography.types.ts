import type { Component } from 'solid-js';

import type { WithConfigComponent } from '~/hocs/withConfig.js';
import type { JSXIntrinsicElement, JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { WithConfig } from '~/types/known.js';
import type { RequiredBy } from '~/types/utils.js';

import type { WithOptionalClasses } from '~/styles/types.js';

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
}

/**
 * Properties passed to the custom component.
 */
export interface TypographyComponentProps {
  class?: string;
}

/**
 * Typography.Custom component properties.
 */
export interface TypographyCustomProps
  extends WithConfig,
    TypographyDefaults,
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
  extends RequiredBy<TypographyCustomProps, keyof TypographyDefaults> {
}

export type CreateTypographyProps<E extends JSXIntrinsicElement> =
  & JSXIntrinsicElementAttrs<E>
  & WithConfig
  & TypographyDefaults
  & WithOptionalClasses<
  TypographyElementKey, (
  & JSXIntrinsicElementAttrs<E>
  & WithConfig
  & Required<TypographyDefaults>
  )>;

/**
 * Typography component public properties.
 */
export type TypographyProps = CreateTypographyProps<'p'>;

/**
 * Typography component properties passed to the classes hooks.
 */
export interface TypographyClassesProps
  extends RequiredBy<TypographyProps, keyof TypographyDefaults> {
}

/**
 * Typography component typing.
 */
export type TypographyComponent =
// Default Typography implementation: <Typography />
  & WithConfigComponent<TypographyProps>
  // Typography implementation which allows using custom rendered content: <Typography.Custom />
  & { Custom: WithConfigComponent<TypographyCustomProps> }
  // Typography implementation allowing usage intrinsic elements: <Typography.h1 />
  & {
  [Element in JSXIntrinsicElement]: WithConfigComponent<CreateTypographyProps<Element>>
};
