import {
  children,
  createMemo,
  createSignal,
  For,
  Show,
  splitProps,
  type JSX,
  type ParentProps,
} from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import {
  isDetailedTableViewCellBox,
  type DetailedTableViewCellBox,
} from '../DetailedTableViewCell/box.js';
import { withDefault } from '../../styles/index.js';

import type { CreateOptionalClasses, WithClasses } from '../../../types.js';

import styles from './styles.module.scss';

const typedStyles = styles as Required<DetailedTableViewClasses>;

export type DetailedTableViewClassName =
  | 'root'
  | 'title'
  | 'table'
  | 'description'
  | 'item'
  | 'itemFirst'
  | 'itemLast';

export type DetailedTableViewClasses = CreateOptionalClasses<DetailedTableViewClassName>;

export interface DetailedTableViewProps extends ParentProps,
  Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'>,
  WithClasses<DetailedTableViewClassName> {
  /**
   * Block content in the bottom part of the component.
   */
  description?: JSX.Element;

  /**
   * Block content in the top part of the component.
   */
  title?: JSX.Element;

  /**
   * True if table and cells are large.
   */
  large?: boolean;
}

export function DetailedTableView(props: DetailedTableViewProps) {
  const [, filteredProps] = splitProps(props, ['title', 'description', 'classes']);
  const classes = createMemo(() => {
    return mergeClassNames(typedStyles, props.classes, { root: withDefault(props.class) });
  });
  const [activeItem, setActiveItem] = createSignal<number>();
  const deactivate = () => setActiveItem();

  const boxes = createMemo(() => {
    return children(() => props.children).toArray().reduce<DetailedTableViewCellBox[]>((acc, item) => {
      if (isDetailedTableViewCellBox(item)) {
        acc.push(item);
      } else {
        console.error(`DetailedTableView received unexpected child:`, item);
      }
      return acc;
    }, []);
  });

  return (
    <div {...filteredProps} class={classes().root}>
      <Show when={classes().title}>
        <div class={styles.title}>{props.title}</div>
      </Show>
      <div class={classes().table}>
        <For each={boxes()}>
          {({ props: boxProps, Component }, index) => {
            const isActive = () => activeItem() === index();
            const isBeforeActive = () => activeItem() === index() + 1;
            const isLast = () => index() === boxes().length - 1;
            const activate = createMemo(() => {
              const idx = index();
              return () => setActiveItem(idx);
            });

            return (
              <Component
                {...boxProps}
                class={classNames(boxProps.class, classes().item, {
                  [classes().itemFirst]: index() === 0,
                  [classes().itemLast]: index() === boxes().length - 1,
                })}
                activate={activate()}
                active={isActive()}
                deactivate={deactivate}
                separator={!isActive() && !isLast() && !isBeforeActive()}
                large={props.large || false}
              />
            );
          }}
        </For>
      </div>
      <Show when={props.description}>
        <div class={classes().description}>{props.description}</div>
      </Show>
    </div>
  );
}