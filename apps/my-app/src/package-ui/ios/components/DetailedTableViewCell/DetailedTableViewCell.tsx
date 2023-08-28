import type { JSX, ParentProps } from 'solid-js';

import { createBox } from '../../../box/index.js';
import { DetailedTableViewCellView } from './DetailedTableViewCellView.js';
import { BOX_TYPE, DetailedTableViewCellBox } from './box.js';

import type { CreateOptionalClasses, WithClasses } from '../../../types.js';

export type DetailedTableViewCellClassName =
  | 'root'
  | 'rootSizeLarge'
  | 'rootFirst'
  | 'rootLast'
  | 'rootActiveElevation1'
  | 'rootActiveElevation2'
  | 'content'
  | 'title'
  | 'titleSizeLarge'
  | 'description'
  | 'icon'
  | 'right'
  | 'label'
  | 'chevron'
  | 'separator'
  | 'separatorHasIcon'
  | 'separatorHasIconSizeLarge';

export type DetailedTableViewCellClasses = CreateOptionalClasses<DetailedTableViewCellClassName>;

export interface DetailedTableViewCellProps extends ParentProps, JSX.HTMLAttributes<HTMLDivElement>,
  WithClasses<DetailedTableViewCellClassName> {
  /**
   * Should chevron be displayed in the end of the cell.
   */
  chevron?: boolean;
  /**
   * True if element can be activated.
   */
  clickable?: boolean;
  /**
   * Content placed under the title.
   */
  description?: JSX.Element;
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

/**
 * DetailedTableViewCell element. Supposed to be used only inside
 * DetailedTableView component.
 * @see DetailedTableView
 * @see https://www.figma.com/file/skT2zRtPpWWu603vK9mk1V/iOS-16-UI-Kit-for-Figma-(Community)?node-id=15%3A2950&mode=dev
 */
export function DetailedTableViewCell(props: DetailedTableViewCellProps) {
  return createBox(BOX_TYPE, DetailedTableViewCellView, props) satisfies DetailedTableViewCellBox as unknown as JSX.Element;
}
