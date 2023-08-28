import { createEffect, createMemo, createSignal, onCleanup, Show, splitProps } from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import { createEventHandler } from '../../../createEventHandler.js';
import { Chevron } from '../../icons/index.js';
import { withDefault } from '../../styles/index.js';

import type {
  DetailedTableViewCellClasses,
  DetailedTableViewCellProps,
} from './DetailedTableViewCell.js';

import styles from './styles.module.scss';

const typedStyles = styles as Required<DetailedTableViewCellClasses>;

export interface DetailedTableViewCellViewProps extends DetailedTableViewCellProps {
  /**
   * Activates current item.
   */
  activate(): void;

  /**
   * True if current element is active.
   */
  active: boolean;

  /**
   * Deactivates current item.
   */
  deactivate(): void;

  /**
   * True if element should have bottom separator.
   */
  separator: boolean;

  /**
   * True if component should be large.
   */
  large: boolean;
}

export function DetailedTableViewCellView(props: DetailedTableViewCellViewProps) {
  const [rootRef, setRootRef] = createSignal<HTMLDivElement>();
  const clickable = createMemo(() => props.clickable || false);
  const elevation = createMemo(() => props.elevation || 1);
  const classes = createMemo(() => {
    const {
      root,
      rootActiveElevation1,
      rootActiveElevation2,
      rootSizeLarge,
      titleSizeLarge,
      title,
      separator,
      separatorHasIcon,
      separatorHasIconSizeLarge,
      ...rest
    } = mergeClassNames(typedStyles, props.classes);
    const isLarge = props.large;

    return {
      ...rest,
      root: withDefault(root, props.class, {
        [rootSizeLarge]: isLarge,
        [rootActiveElevation1]: clickable() && elevation() === 1 && props.active,
        [rootActiveElevation2]: clickable() && elevation() === 2 && props.active,
      }),
      title: classNames(title, {
        [titleSizeLarge]: isLarge,
      }),
      separator: classNames(separator, {
        [separatorHasIcon]: props.icon,
        [separatorHasIconSizeLarge]: props.icon && isLarge,
      }),
    };
  });

  const onActivate = createMemo(() => {
    const activate = props.activate;
    const active = props.active;
    const isClickable = clickable();

    return () => {
      if (isClickable && !active) {
        activate();
      }
    };
  });

  const onDeactivate = createMemo(() => {
    const deactivate = props.deactivate;
    const active = props.active;
    const isClickable = clickable();

    return () => {
      if (isClickable && active) {
        deactivate();
      }
    };
  });

  const onPointerDown = createEventHandler(() => props.onPointerDown, onActivate);
  const onTouchCancel = createEventHandler(() => props.onTouchCancel, onDeactivate);
  const onTouchEnd = createEventHandler(() => props.onTouchEnd, onDeactivate);

  const [, rootProps] = splitProps(
    props,
    [
      'icon', 'label', 'children', 'title', 'classes', 'chevron',
      'elevation', 'separator', 'clickable', 'activate', 'deactivate', 'active',
    ],
  );

  // In case, component became active, we should add special listeners to document
  // to deactivate this component.
  createEffect(() => {
    const deactivate = onDeactivate();
    const events = ['scroll', 'pointerup'];

    events.forEach(e => window.addEventListener(e, deactivate));

    onCleanup(() => {
      events.forEach(e => window.removeEventListener(e, deactivate));
    });
  });

  // When component becomes active, we should check if touch left the root.
  // In case it did, we are deactivating item.
  createEffect(() => {
    const deactivate = onDeactivate();
    const ref = rootRef();

    if (!props.active || !ref) {
      return;
    }

    const onTouchMove = (e: TouchEvent) => {
      const { clientX, clientY } = e.touches[0];
      const {x, y, width, height} = ref.getBoundingClientRect();

      if (clientX < x || x + width < clientX || clientY < y || y + height < clientY) {
        deactivate();
      }
    };

    window.addEventListener('touchmove', onTouchMove);

    onCleanup(() => {
      window.removeEventListener('touchmove', onTouchMove);
    });
  })

  return (
    <div
      {...rootProps}
      ref={setRootRef}
      class={classes().root}
      onPointerDown={onPointerDown()}
      onTouchCancel={onTouchCancel()}
      onTouchEnd={onTouchEnd()}
    >
      <Show when={props.icon}>
        <div class={classes().icon}>{props.icon}</div>
      </Show>
      <div class={classes().content}>
        <p class={classes().title}>{props.title}</p>
        <div class={classes().description}>{props.description}</div>
      </div>
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
      <Show when={props.separator}>
        <div class={classes().separator}/>
      </Show>
    </div>
  );
}
