import type { JSX } from 'solid-js';

export type ButtonType =
  | 'fill'
  | 'bezeled'
  | 'plain'
  | 'gray'
  | 'outline'
  | 'white';

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  /**
   * Should button use all width available.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Should button corners be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * Button variant.
   * @default 'fill'
   */
  type?: ButtonType;
}
