import { Box, isBoxOfType } from '../../../box/index.js';
import type { TableViewCellViewProps } from './TableViewCellView.js';
import type { TableViewCellProps } from './TableViewCell.js';

export type TableViewCellBox = Box<typeof BOX_TYPE, TableViewCellProps, TableViewCellViewProps>;

export function isTableViewCellBox(value: unknown): value is TableViewCellBox {
  return isBoxOfType(value, BOX_TYPE);
}

export const BOX_TYPE = 'TableViewCell';