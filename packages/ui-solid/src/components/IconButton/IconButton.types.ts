import type { FlowProps } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { WithConfig } from '~/types/known.js';
import type { RequiredBy } from '~/types/utils.js';

import type { WithOptionalClasses } from '~/styles/types.js';

import type { ButtonProps } from '~/components/Button/Button.types.js';

/**
 * IconButton variant.
 */
export type IconButtonVariant =
  | 'bezeled'
  | 'plain'
  | 'gray';

/**
 * List of component element keys allowed to be modified.
 */
export type IconButtonElementKey = 'root' | 'iconContainer' | 'icon';

/**
 * IconButton size.
 */
export type IconButtonSize = 'sm' | 'md' | 'lg';

/**
 * Component properties, having defaults.
 */
export interface IconButtonDefaults {
  /**
   * Disables the button.
   * @default false
   */
  disabled?: boolean;
  /**
   * Completely rounds the button corners.
   * @default false
   */
  rounded?: boolean;
  /**
   * Component size.
   * @default 'md'
   */
  size?: IconButtonSize;
  /**
   * Component variant.
   * @default 'bezeled'
   */
  variant?: IconButtonVariant;
}

/**
 * IconButton component public properties.
 */
export interface IconButtonProps
  extends FlowProps<{}, ButtonProps['icon']>,
    Omit<JSXIntrinsicElementAttrs<'button'>, 'children'>,
    WithConfig,
    IconButtonDefaults,
    WithOptionalClasses<IconButtonElementKey, IconButtonClassesProps> {
  /**
   * Enables or disables ripples.
   * @default Depends on the platform. True for the `base` platform.
   */
  ripples?: boolean;
}

/**
 * IconButton component properties passed to the classes hooks.
 */
export interface IconButtonClassesProps
  extends RequiredBy<IconButtonProps, keyof IconButtonDefaults> {
}
