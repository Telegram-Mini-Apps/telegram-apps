import { Box, createBox, isBoxOfType } from '../../../box/index.js';
import { AlertItemProps } from './AlertItem.js';
import { AlertItemView, AlertItemViewProps } from './AlertItemView.js';

export type AlertItemBox = Box<typeof BOX_TYPE, AlertItemProps, AlertItemViewProps>;

export function isAlertItemBox(value: unknown): value is AlertItemBox {
  return isBoxOfType(value, BOX_TYPE);
}

export function createAlertItemBox(props: AlertItemProps): AlertItemBox {
  return createBox(BOX_TYPE, AlertItemView, props);
}

export const BOX_TYPE = 'AlertItem';