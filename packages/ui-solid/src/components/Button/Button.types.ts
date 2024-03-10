import type { Component, JSX, JSXElement } from 'solid-js';

import type { LoaderProps, WithComponentProps } from '~components';
import type { WithOptionalClasses } from '~styles';
import type { RequiredBy } from '~types';

export type ButtonType =
  | 'fill'
  | 'bezeled'
  | 'plain'
  | 'gray'
  | 'outline'
  | 'white';

export type ButtonElementKey = 'root' | 'content' | 'loader' | 'iconContainer' | 'icon';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonIcon = Component<{ class?: string }> | JSXElement;

export interface ButtonPropsDefaults extends WithComponentProps {
  /**
   * Is Button disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Should button use all width available.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Should component replace the icon inside with the Loader component. Enabling this
   * property will ignore the value of the property passed in the `icon`.
   * @default false
   */
  loading?: boolean;
  /**
   * Should button corners be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * Button size.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Button variant.
   * @default 'fill'
   */
  type?: ButtonType;
  Loader?: Component<LoaderProps>;
}

export interface ButtonClassesProps extends RequiredBy<ButtonProps, keyof ButtonPropsDefaults> {
}

export interface ButtonProps
  extends JSX.HTMLAttributes<HTMLButtonElement>,
    WithOptionalClasses<ButtonElementKey, any>,
    ButtonPropsDefaults {
  /**
   * Icon to be displayed before the content.
   */
  icon?: ButtonIcon;
}
