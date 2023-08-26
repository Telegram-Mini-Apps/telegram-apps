import { Box, isBoxOfType } from '../../../box/index.js';
import type { DetailedTableViewCellViewProps } from './DetailedTableViewCellView.js';
import type { DetailedTableViewCellProps } from './DetailedTableViewCell.js';

export type DetailedTableViewCellBox = Box<typeof BOX_TYPE, DetailedTableViewCellProps, DetailedTableViewCellViewProps>;

export function isDetailedTableViewCellBox(value: unknown): value is DetailedTableViewCellBox {
  return isBoxOfType(value, BOX_TYPE);
}

export const BOX_TYPE = 'DetailedTableViewCell';