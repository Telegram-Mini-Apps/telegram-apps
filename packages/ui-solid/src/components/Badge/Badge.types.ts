import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { RequiredBy } from '~/types/utils.js';

import type { WithOptionalClasses } from '~/styles/types.js';

import type { WithConfig } from '~/components/types.js';

/**
 * Known Badge sizes.
 */
export type BadgeSize = 'dot' | 'sm' | 'lg';

/**
 * Known Badge variant.
 */
export type BadgeVariant = 'default' | 'critical' | 'secondary' | 'gray' | 'white';

/**
 * Badge component element keys allowed to be customized.
 */
export type BadgeElementKey = 'root';

/**
 * Component properties, having defaults.
 */
export interface BadgeDefaults {
  /**
   * Badge size.
   * @default 'sm'
   */
  size?: BadgeSize;
  /**
   * Badge variant.
   * @default 'default'
   */
  variant?: BadgeVariant;
}

/**
 * Badge component public properties.
 */
export interface BadgeProps
  extends JSXIntrinsicElementAttrs<'span'>,
    WithConfig,
    BadgeDefaults,
    WithOptionalClasses<BadgeElementKey, BadgeClassesProps> {
}

/**
 * Badge component properties passed to the classes hooks.
 */
export interface BadgeClassesProps extends RequiredBy<BadgeProps, keyof BadgeDefaults> {
}
