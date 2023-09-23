import type { JSX, ParentProps } from 'solid-js';

import { createBox } from '../../../box/index.js';
import { TableViewCellView } from './TableViewCellView.js';
import { BOX_TYPE, type TableViewCellBox } from './box.js';

import type { WithClasses, CreateClasses } from '../../../types.js';

export type TableViewCellClassName =
  | 'root'
  | 'rootActiveElevation1'
  | 'rootActiveElevation2'
  | 'title'
  | 'icon'
  | 'right'
  | 'label'
  | 'chevron'
  | 'separator'
  | 'separatorHasIcon';

export type TableViewCellClasses = CreateClasses<TableViewCellClassName>;

export interface TableViewCellProps extends ParentProps, JSX.HTMLAttributes<HTMLDivElement>,
  WithClasses<TableViewCellClassName> {
  /**
   * Should chevron be displayed in the end of the cell.
   */
  chevron?: boolean;

  /**
   * True if element can be activated.
   */
  clickable?: boolean;

  /**
   * Elevation level. Affects only cell background color when item becomes
   * active.
   */
  elevation?: 1 | 2;

  /**
   * Icon displayed in the beginning of the cell.
   */
  icon?: JSX.Element;

  /**
   * Cell label placed in the end of the cell.
   */
  label?: string;

  /**
   * Cell title.
   */
  title: string;
}

export function TableViewCell(props: TableViewCellProps) {
  return createBox(BOX_TYPE, TableViewCellView, props) satisfies TableViewCellBox as unknown as JSX.Element;
}
