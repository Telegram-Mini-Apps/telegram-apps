import type { JSX } from 'solid-js';

import type { WithOptionalClasses } from '../../styles/index.js';
import type { RequiredBy } from '../../types/index.js';
import type { WithComponentProps } from '../types.js';

export type ButtonType =
  | 'fill'
  | 'bezeled'
  | 'plain'
  | 'gray'
  | 'outline'
  | 'white';

export type ButtonElementKey = 'root' | 'content' | 'loader';

export type ButtonSize = 'sm' | 'md' | 'lg';

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
   * Is Button currently loading.
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
}

export interface ButtonClassesProps extends RequiredBy<ButtonProps, keyof ButtonPropsDefaults> {
}

export interface ButtonProps
  extends JSX.HTMLAttributes<HTMLButtonElement>,
    WithOptionalClasses<ButtonElementKey, any>,
    ButtonPropsDefaults {
}
