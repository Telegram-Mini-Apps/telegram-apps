import {
  createMemo,
  splitProps,
  Show,
  createEffect,
  onCleanup,
  type JSX,
  type ParentProps, createSignal,
} from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import { createEventHandler } from '../../../createEventHandler.js';

import type { CreateOptionalClasses, CreateRequiredClasses, WithClasses } from '../../../types.js';

import styles from './styles.module.scss';

const typedStyles = styles as CreateRequiredClasses<TableViewClassName>;

export type TableViewClassName =
  | 'root'
  | 'rootSizeSmall'
  | 'rootSizeMedium'
  | 'rootSizeLarge'
  | 'rootElevation1'
  | 'rootElevation2'
  | 'left'
  | 'right'
  | 'rightHasSeparator';

export type TableViewClasses = CreateOptionalClasses<TableViewClassName>;

export interface TableViewCellProps extends ParentProps,
  WithClasses<TableViewClassName>,
  JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Is item currently active.
   * @default false
   */
  active?: boolean;

  /**
   * Item elevation. The higher value, the darker active background.
   * @default 1
   */
  elevation?: 1 | 2;

  /**
   * Content in the left part of the component.
   */
  left?: JSX.Element;

  /**
   * Being called when item activates.
   */
  onActivate?(): void;

  /**
   * Being called when item deactivates.
   */
  onDeactivate?(): void;

  /**
   * Should bottom separator be displayed.
   * @default false
   */
  separator?: boolean;

  /**
   * Component size type.
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large';
}

export function _TableViewCell(props: TableViewCellProps) {
  const [rootRef, setRootRef] = createSignal<HTMLDivElement>();
  const classes = createMemo(() => {
    const {
      root,
      rootSizeLarge,
      rootSizeMedium,
      rootSizeSmall,
      rootElevation1,
      rootElevation2,
      right,
      rightHasSeparator,
      ...rest
    } = mergeClassNames(typedStyles, props.classes, { root: props.class });
    const size = props.size || 'small';
    const elevation = props.elevation || 1;

    return {
      ...rest,
      root: classNames(root, {
        [rootSizeSmall]: size === 'small',
        [rootSizeMedium]: size === 'medium',
        [rootSizeLarge]: size === 'large',
        [rootElevation1]: elevation === 1 && props.active,
        [rootElevation2]: elevation === 2 && props.active,
      }),
      right: classNames(right, {
        [rightHasSeparator]: props.separator,
      }),
    };
  });

  const [, restProps] = splitProps(props, ['classes', 'left', 'size', 'active', 'onActivate', 'onDeactivate']);

  const onActivate = createMemo(() => {
    const onActivate = props.onActivate;
    return () => {
      onActivate?.();
    };
  });

  const onDeactivate = createMemo(() => {
    const onDeactivate = props.onDeactivate;
    return () => {
      onDeactivate?.();
    };
  });

  const onPointerDown = createEventHandler(() => props.onPointerDown, onActivate);
  const onTouchCancel = createEventHandler(() => props.onTouchCancel, onDeactivate);
  const onTouchEnd = createEventHandler(() => props.onTouchEnd, onDeactivate);

  // In case, component became active, we should add special listeners to document
  // to deactivate this component.
  createEffect(() => {
    const deactivate = props.onDeactivate;

    if (!props.active || !deactivate) {
      return;
    }

    const events = ['scroll', 'pointerup'];

    events.forEach(e => window.addEventListener(e, deactivate));

    onCleanup(() => {
      events.forEach(e => window.removeEventListener(e, deactivate));
    });
  });

  // When component becomes active, we should check if touch left the root.
  // In case it did, we are deactivating item.
  createEffect(() => {
    const deactivate = props.onDeactivate;
    const ref = rootRef();

    if (!props.active || !deactivate || !ref) {
      return;
    }

    const onTouchMove = (e: TouchEvent) => {
      const { clientX, clientY } = e.touches[0];
      // TODO: Throttle getBoundingClientRect.
      const { x, y, width, height } = ref.getBoundingClientRect();

      if (clientX < x || x + width < clientX || clientY < y || y + height < clientY) {
        deactivate();
      }
    };

    window.addEventListener('touchmove', onTouchMove);

    onCleanup(() => {
      window.removeEventListener('touchmove', onTouchMove);
    });
  });

  return (
    <div
      {...restProps}
      class={classes().root}
      onPointerDown={onPointerDown()}
      onTouchCancel={onTouchCancel()}
      onTouchEnd={onTouchEnd()}
      ref={setRootRef}
    >
      <Show when={props.left}>
        <div class={classes().left}>{props.left}</div>
      </Show>
      <div class={classes().right}>{props.children}</div>
    </div>
  );
}
