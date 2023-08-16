import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  JSX, on, onCleanup, onMount,
  ParentProps,
  Show,
  splitProps, untrack,
} from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import { Chevron } from '../../icons';
import { createHandler } from '../../../createHandler';

import { CreateClasses, WithClasses } from '../../../types';

import styles from './styles.module.scss';
import { useTableViewContext } from '../TableView/context';

type Styles = Required<TableViewCellClasses>;

export type TableViewCellClassName =
  | 'root'
  | 'rootFirst'
  | 'rootLast'
  | 'rootActiveLevel1'
  | 'rootActiveLevel2'
  | 'title'
  | 'icon'
  | 'right'
  | 'label'
  | 'chevron'
  | 'bottomLine'
  | 'bottomLineHasIcon';

export type TableViewCellClasses = CreateClasses<TableViewCellClassName>;

export interface TableViewCellProps extends ParentProps, JSX.HTMLAttributes<HTMLDivElement>,
  WithClasses<TableViewCellClasses> {
  chevron?: boolean;
  clickableLevel?: 1 | 2;
  icon?: JSX.Element;
  label?: string;
  middle?: JSX.Element;
  title: string;
}

type UseMetaTuple = [
  hideBottomLine: Accessor<boolean>,
  first: Accessor<boolean>,
  last: Accessor<boolean>
];

function useMeta(): UseMetaTuple {
  const context = useTableViewContext();

  if (context === undefined) {
    return [() => true, () => true, () => true];
  }

  const [index, setIndex] = createSignal(context.items().length);
  const first = createMemo(() => index() === 0);
  const last = createMemo(() => context.items().length === index() + 1);
  const hideBottomLine = createMemo(() => {

  });

  createEffect(on([], () => {
    const meta = context.register()();

    setIndex(meta.index);

    onCleanup(() => context.unregister(meta.index));
  }));

  return [first, last];
}

/**
 * @see https://www.figma.com/file/skT2zRtPpWWu603vK9mk1V/iOS-16-UI-Kit-for-Figma-(Community)?node-id=1033%3A5368&mode=dev
 * @constructor
 */
export function TableViewCell(props: TableViewCellProps) {
  let rootRef: HTMLDivElement;
  const [active, setActive] = createSignal(false);
  const [first, last] = useMeta();

  const enable = () => setActive(true);
  const disable = () => setActive(false);

  // Sure?
  const onMouseDown = createHandler(() => props.onMouseDown, enable);
  const onMouseUp = createHandler(() => props.onMouseUp, disable);
  const onMouseLeave = createHandler(() => props.onMouseLeave, disable);

  const onTouchStart = createHandler(() => props.onTouchStart, enable);
  const onTouchEnd = createHandler(() => props.onTouchEnd, disable);
  const onTouchCancel = createHandler(() => props.onTouchCancel, disable);

  const mergedClasses = createMemo<Styles>(() => mergeClassNames(styles, props.classes));
  const classes = createMemo(() => {
    const {
      root,
      rootFirst,
      rootLast,
      rootActiveLevel1,
      rootActiveLevel2,
      bottomLine,
      bottomLineHasIcon,
      ...rest
    } = mergedClasses();

    return {
      ...rest,
      root: classNames(root, props.class, {
        [rootFirst]: first(),
        [rootLast]: last(),
        [rootActiveLevel1]: props.clickableLevel === 1 && active(),
        [rootActiveLevel2]: props.clickableLevel === 2 && active(),
      }),
      bottomLine: classNames(bottomLine, {
        [bottomLineHasIcon]: props.icon,
      }),
    };
  });

  const [, rootProps] = splitProps(
    props,
    [
      'icon', 'middle', 'label', 'children', 'title', 'classes', 'chevron',
      'clickableLevel',
    ],
  );

  createEffect(() => {
    if (!active()) {
      return;
    }

    const onMove = (e: TouchEvent) => {

    };

    const onScroll = () => setActive(false);

    window.addEventListener('touchmove', onMove);
    window.addEventListener('scroll', onScroll);

    onCleanup(() => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('scroll', onScroll);
    });
  });

  return (
    <div
      {...rootProps}
      class={classes().root}
      onMouseUp={onMouseUp()}
      onMouseDown={onMouseDown()}
      onMouseLeave={onMouseLeave()}
      onTouchStart={onTouchStart()}
      onTouchEnd={onTouchEnd()}
      onTouchCancel={onTouchCancel()}
      ref={r => rootRef = r}
    >
      <Show when={props.icon}>
        <div class={classes().icon}>{props.icon}</div>
      </Show>
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
      <Show when={!last()}>
        <div class={classes().bottomLine}/>
      </Show>
    </div>
  );
}