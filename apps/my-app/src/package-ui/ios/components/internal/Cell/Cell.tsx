import {
  createMemo,
  splitProps,
  Show,
  type JSX,
  type ParentProps,
} from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import type {
  CreateOptionalClasses,
  CreateRequiredClasses,
  WithClasses,
} from '../../../../types.js';

import styles from './styles.module.scss';

const typedStyles = styles as CreateRequiredClasses<CellClassName>;

export type CellClassName =
  | 'root'
  | 'before'
  | 'after'
  | 'afterHasSeparator';

export type CellClasses = CreateOptionalClasses<CellClassName>;

export interface CellProps extends ParentProps,
  WithClasses<CellClassName>,
  JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Content in the left part of the component.
   */
  before?: JSX.Element;

  /**
   * Root element reference.
   * @param el - element reference.
   */
  ref?(el: HTMLDivElement): void;

  /**
   * Should bottom separator be displayed.
   * @default false
   */
  separator?: boolean;
}

export function Cell(props: CellProps) {
  const classes = createMemo(() => {
    const {
      after,
      afterHasSeparator,
      ...rest
    } = mergeClassNames(typedStyles, props.classes, { root: props.class });

    return {
      ...rest,
      after: classNames(after, { [afterHasSeparator]: props.separator }),
    };
  });

  const [, restProps] = splitProps(props, ['classes', 'before', 'separator']);

  return (
    <div {...restProps} class={classes().root}>
      <Show when={props.before}>
        <div class={classes().before}>{props.before}</div>
      </Show>
      <div class={classes().after}>{props.children}</div>
    </div>
  );
}
