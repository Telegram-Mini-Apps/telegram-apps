import { createEffect, createMemo, createSignal, JSX, ParentProps, Show } from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import { TableViewContext, TableViewContextType, TableViewContextItem } from './context';

import { CreateClasses, WithClasses } from '../../../types';

import styles from './styles.module.scss';

export type TableViewClassName = 'root' | 'title' | 'table' | 'description';
export type TableViewClasses = CreateClasses<TableViewClassName>;

export interface TableViewProps extends ParentProps, JSX.HTMLAttributes<HTMLDivElement>,
  WithClasses<TableViewClasses> {
  title?: string;
  description?: string;
}

/**
 * @see https://www.figma.com/file/skT2zRtPpWWu603vK9mk1V/iOS-16-UI-Kit-for-Figma-(Community)?node-id=38%3A2308&mode=dev
 */
export function TableView(props: TableViewProps) {
  const classes = createMemo<TableViewClasses>(() => mergeClassNames(styles, props.classes));
  const [items, setItems] = createSignal<TableViewContextItem[]>([]);

  const register = createMemo(() => {
    const itemsArr = items();

    return (): TableViewContextItem => {
      const item: TableViewContextItem = {
        index: itemsArr.length,
      };

      setItems([...itemsArr, item]);

      return item;
    };
  });

  const context: TableViewContextType = {
    items,
    register() {
      setItems([...itemsArr, item]);
    },
    unregister(index: number) {
      setItems(items => {
        return items.reduce<TableViewContextItem[]>((acc, item) => {
          if (item.index < index) {
            acc.push(item);
          } else if (item.index > index) {
            acc.push({ ...item, index: item.index - 1 });
          }
          return acc;
        }, []);
      });
    },
  };

  return (
    <TableViewContext.Provider value={context}>
      <div class={classNames(classes().root, props.class)}>
        <Show when={classes().title}>
          <p class={styles.title}>{props.title}</p>
        </Show>
        <div class={classes().table}>{props.children}</div>
        <Show when={props.description}>
          <p class={classes().description}>{props.description}</p>
        </Show>
      </div>
    </TableViewContext.Provider>
  );
}
