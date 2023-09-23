import { createEffect, createMemo, createSignal, onCleanup, splitProps } from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import { Cell, type CellClassName, type CellProps } from '../Cell/index.js';
import { createEventHandler } from '../../../../createEventHandler.js';

import type {
  CreateOptionalClasses,
  CreateRequiredClasses,
} from '../../../../types.js';

import styles from './styles.module.scss';

const typedStyles = styles as CreateRequiredClasses<OwnClassName>;

type OwnClassName = 'root' | 'rootElevation1' | 'rootElevation2';

export type InteractiveCellClassName = CellClassName | OwnClassName;

export type InteractiveCellClasses = CreateOptionalClasses<InteractiveCellClassName>;

export interface InteractiveCellProps extends CellProps {
  /**
   * Is item currently active. In case, no value is specified, components becomes
   * uncontrolled. In this case component stores and controls this value internally.
   *
   * In case, clickable is false, active is will be fixed to false value.
   * @default false
   */
  active?: boolean;

  /**
   * Is component clickable. If passed value is false, component is not
   * calling any activation handlers and ignores active property.
   * @default true
   */
  clickable?: boolean;

  /**
   * Item elevation. The higher value, the darker active background.
   * @default 1
   */
  elevation?: 1 | 2;

  /**
   * Being called when item wants to become active.
   */
  onActivate?(): void;

  /**
   * Being called when item wants to become inactive.
   */
  onDeactivate?(): void;
}

export function InteractiveCell(props: InteractiveCellProps) {
  const [getRootRef, setRootRef] = createSignal<HTMLDivElement>();
  const [getActive, setActive] = createSignal<boolean>(props.active || false);

  const classes = createMemo(() => {
    const {
      root,
      rootElevation1,
      rootElevation2,
      ...rest
    } = mergeClassNames(typedStyles, props.classes);
    const elevation = props.elevation || 1;
    const active = getActive();

    return {
      ...rest,
      root: classNames(root, {
        [rootElevation1]: active && elevation === 1,
        [rootElevation2]: active && elevation === 2,
      }),
    };
  });

  // Extend ref handler.
  const ref = createMemo(() => {
    const setOriginalRef = props.ref;

    return (el: HTMLDivElement) => {
      setOriginalRef?.(el);
      setRootRef(el);
    };
  });

  // Remove extra properties.
  const [, filteredProps] = splitProps(props, ['onActivate', 'onDeactivate', 'elevation', 'clickable', 'active', 'classes']);

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

  // Create DOM events handlers which will call activation handlers.
  const onPointerDown = createEventHandler(() => props.onPointerDown, onActivate);
  const onTouchCancel = createEventHandler(() => props.onTouchCancel, onDeactivate);
  const onTouchEnd = createEventHandler(() => props.onTouchEnd, onDeactivate);

  // When active state was changed externally, we should update it locally.
  createEffect(() => {
    const active = props.active;

    if (typeof active === 'boolean') {
      setActive(active);
    }
  });

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
    const ref = getRootRef();

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
    <Cell
      {...filteredProps}
      classes={classes()}
      onPointerDown={onPointerDown()}
      onTouchCancel={onTouchCancel()}
      onTouchEnd={onTouchEnd()}
      ref={ref()}
    />
  );
}
