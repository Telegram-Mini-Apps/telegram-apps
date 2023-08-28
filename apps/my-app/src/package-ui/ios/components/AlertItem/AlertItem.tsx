import type { JSX, ParentProps } from 'solid-js';

import { createAlertItemBox } from './box.js';

import type { CreateOptionalClasses, WithClasses } from '../../../types.js';

export type AlertItemClassName = 'root' | 'rootVariantPrimary' | 'rootVariantSecondary';

export type AlertItemClasses = CreateOptionalClasses<AlertItemClassName>;

export interface AlertItemProps extends ParentProps,
  Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'>,
  WithClasses<AlertItemClassName> {
  title: string;
  /**
   * @default 'secondary'
   */
  variant?: 'primary' | 'secondary';
}

/**
 * @see https://www.figma.com/file/skT2zRtPpWWu603vK9mk1V/iOS-16-UI-Kit-for-Figma-(Community)?node-id=9%3A1317&mode=dev
 */
export function AlertItem(props: AlertItemProps) {
  return createAlertItemBox(props) as unknown as JSX.Element;
}