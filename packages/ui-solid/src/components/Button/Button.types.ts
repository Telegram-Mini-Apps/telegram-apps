import type { WithComponentProps } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { ComponentSlot } from '~/types/components.js';
import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { RequiredBy } from '~/types/utils.js';

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

export interface ButtonPropsDefaults extends WithComponentProps {
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
   * Button size.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Stretches the button horizontally.
   * @default false
   */
  stretched?: boolean;
  /**
   * Button variant.
   * @default 'fill'
   */
  variant?: ButtonVariant;
}

export interface ButtonClassesProps extends RequiredBy<ButtonProps, keyof ButtonPropsDefaults> {
}

export interface ButtonProps
  extends JSXIntrinsicElementAttrs<'button'>,
    WithOptionalClasses<ButtonElementKey, ButtonClassesProps>,
    ButtonPropsDefaults {
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
