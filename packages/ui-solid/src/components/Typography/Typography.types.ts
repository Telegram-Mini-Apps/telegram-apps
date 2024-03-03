import type { JSX } from 'solid-js';

import type { WithOptionalClasses } from '../../styles/index.js';
import type { RequiredBy } from '../../types/index.js';
import type { WithComponentProps } from '../types.js';

// Figma reference:
// https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=216-1907&mode=design&t=nUrQwsUgG6ktNuOf-0

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

export type TypographyAs = Extract<keyof JSX.IntrinsicElements,
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'span'
  | 'label'
  | 'p'
>;

/**
 * List of component element keys.
 */
export type TypographyElementKey = 'root';

export type TypographyWeight = 'regular' | 'semibold' | 'bold';

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

export interface TypographyClassesProps
  extends RequiredBy<TypographyProps, keyof TypographyPropsDefaults> {
}

export type TypographyProps<As extends TypographyAs = 'p'> =
  TypographyPropsDefaults
  & WithOptionalClasses<TypographyElementKey, TypographyClassesProps>
  & (
  'p' extends As
    ? (JSX.IntrinsicElements['p'] & { as?: 'p' })
    : (JSX.IntrinsicElements[As] & { as: As })
  );
