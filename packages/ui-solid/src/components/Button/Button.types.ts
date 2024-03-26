import type { ComponentSlot } from '~/types/components.js';
import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { WithConfig } from '~/types/known.js';
import type { RequiredBy } from '~/types/utils.js';

import type { WithOptionalClasses } from '~/styles/types.js';

/**
 * Button variant.
 */
export type ButtonVariant =
  | 'fill'
  | 'bezeled'
  | 'plain'
  | 'gray'
  | 'outline'
  | 'white';

/**
 * List of component element keys allowed to be modified.
 */
export type ButtonElementKey =
  | 'root'
  | 'before'
  | 'content'
  | 'after'
  | 'loader'
  | 'iconContainer'
  | 'icon';

/**
 * Button size.
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Component properties, having defaults.
 */
export interface ButtonDefaults {
  /**
   * Disables the button.
   * @default false
   */
  disabled?: boolean;
  /**
   * Replaces the icon inside with the Loader component. Enabling this property will ignore
   * the value of the property passed in the `icon`.
   * @default false
   */
  loading?: boolean;
  /**
   * Completely rounds the button corners.
   * @default false
   */
  rounded?: boolean;
  /**
   * Component size.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Stretches the button horizontally.
   * @default false
   */
  stretched?: boolean;
  /**
   * Component variant.
   * @default 'fill'
   */
  variant?: ButtonVariant;
}

/**
 * Button component public properties.
 */
export interface ButtonProps
  extends JSXIntrinsicElementAttrs<'button'>,
    WithConfig,
    ButtonDefaults,
    WithOptionalClasses<ButtonElementKey, ButtonClassesProps> {
  /**
   * Content to display after the main content.
   */
  after?: ComponentSlot;
  /**
   * Content to display between the icon and main content.
   */
  before?: ComponentSlot;
  /**
   * Icon to be displayed before the content.
   */
  icon?: ComponentSlot<{ class?: string }>;
  /**
   * Enables or disables ripples.
   * @default Depends on the platform. True for the `base` platform.
   */
  ripples?: boolean;
}

/**
 * Button component properties passed to the classes hooks.
 */
export interface ButtonClassesProps extends RequiredBy<ButtonProps, keyof ButtonDefaults> {
}
