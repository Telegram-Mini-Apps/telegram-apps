import { createEffect, createMemo, createSignal, onCleanup, Show, splitProps } from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import { withDefault } from '../../styles/index.js';
import { createEventHandler } from '../../../createEventHandler.js';
import { Chevron } from '../../icons/index.js';
import {InteractiveCell} from '../internal/InteractiveCell/index.js';
import type { TableViewCellClasses, TableViewCellProps } from './TableViewCell.js';

import styles from './styles.module.scss';

const typedStyles = styles as Required<TableViewCellClasses>;

export interface TableViewCellViewProps extends TableViewCellProps {
  /**
   * Activates current item.
   */
  onActivate(): void;

  /**
   * True if current element is active.
   */
  active: boolean;

  /**
   * Deactivates current item.
   */
  onDeactivate(): void;

  /**
   * True if element should have bottom separator.
   */
  separator: boolean;
}

export function TableViewCellView(props: TableViewCellViewProps) {
  const classes = createMemo(() => {
    const {
      root,
      rootActiveElevation1,
      rootActiveElevation2,
      separator,
      separatorHasIcon,
      ...rest
    } = mergeClassNames(typedStyles, props.classes);

    return {
      ...rest,
      root: withDefault(root, props.class, {
        [rootActiveElevation1]: clickable() && elevation() === 1 && props.active,
        [rootActiveElevation2]: clickable() && elevation() === 2 && props.active,
      }),
      separator: classNames(separator, { [separatorHasIcon]: props.icon }),
    };
  });

  const [, rootProps] = splitProps(
    props,
    [
      'icon', 'label', 'children', 'title', 'classes', 'chevron',
      'elevation', 'separator', 'active',
    ],
  );

  return (
    <_TableViewCell
      active={props.active}
      elevation={props.elevation}
      left={
        <Show when={props.icon}>
          <div class={classes().icon}>{props.icon}</div>
        </Show>
      }
      onActivate={props.onActivate}
      onDeactivate={props.onDeactivate}
      separator={props.separator}
      size="small"
    >
      <p class={classes().title}>{props.title}</p>
      <Show when={props.children || props.label || props.chevron}>
        <div class={classes().right}>
          <Show when={props.label}>
            <p class={classes().label}>{props.label}</p>
          </Show>
          <Show when={props.children}>{props.children}</Show>
          <Show when={props.chevron}>
            <Chevron class={classes().chevron} width={8} height={14}/>
          </Show>
        </div>
      </Show>
    </_TableViewCell>
  );
}