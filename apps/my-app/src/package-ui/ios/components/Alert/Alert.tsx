import { children, createMemo, createSignal, For, JSX, on, ParentProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { mergeClassNames } from '@twa.js/utils';

import { AlertItemBox, createAlertItemBox, isAlertItemBox } from '../AlertItem/box.js';
import { withDefault } from '../../styles/index.js';

import type { CreateOptionalClasses, WithClasses } from '../../../types.js';

import styles from './styles.module.scss';
import { createEventHandler } from '../../../createEventHandler.js';
import { Transition } from 'solid-transition-group';

const typedStyles = styles as Required<AlertClasses>;

export type AlertClassName = 'root' | 'alert' | 'title' | 'content' | 'children' | 'actions';

export type AlertClasses = CreateOptionalClasses<AlertClassName>;

export interface AlertProps extends ParentProps,
  Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'>,
  WithClasses<AlertClassName> {
  /**
   * Alert title.
   */
  title: string;

  /**
   * Should Alert be shown.
   */
  show?: boolean;
}

const ANIMATION_SETTINGS = {
  duration: 200,
  // Don't really know why, but this property repairs animation in Safari.
  fill: 'both',
} as const;

/**
 * @see https://www.figma.com/file/skT2zRtPpWWu603vK9mk1V/iOS-16-UI-Kit-for-Figma-(Community)?node-id=9%3A1331&mode=dev
 */
export function Alert(props: AlertProps) {
  const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement>();
  const classes = createMemo(() => mergeClassNames(typedStyles, props.classes, {
    root: withDefault(),
  }));

  // We should create 2 separate arrays, representing current
  // component children. The first one should contain children which are usual JSX elements,
  // the second one contains boxes, which could represent both AlertItem and AlertLine.
  const childrenFiltered = createMemo(() => {
    return children(() => props.children)
      .toArray()
      .reduce<{ usual: JSX.Element[], boxes: AlertItemBox[] }>((acc, child) => {
        if (isAlertItemBox(child)) {
          acc.boxes.push(child);
        } else {
          acc.usual.push(child);
        }
        return acc;
      }, { usual: [], boxes: [] });
  });

  // Represents enter transition.
  const onEnter = createMemo(() => {
    const wrapper = dialogRef();

    if (!wrapper) {
      return;
    }

    return (element: Element, done: () => void) => {
      Promise
        .all([
          element.animate({opacity: [0, 1]}, ANIMATION_SETTINGS).finished,
          wrapper
            .animate([
              { transform: 'translate(-50%, -50%) scale(0.95)' },
              { transform: 'translate(-50%, -50%) scale(1.03)' },
              { transform: 'translate(-50%, -50%) scale(1)' },
            ], ANIMATION_SETTINGS)
            .finished,
        ])
        .then(done);
    };
  });

  // Represents exit transition.
  const onExit = createMemo(() => {
    const wrapper = dialogRef();

    if (!wrapper) {
      return;
    }

    return (root: Element, done: () => void) => {
      Promise
        .all([
          root.animate({ opacity: [1, 0] }, ANIMATION_SETTINGS).finished,
          wrapper
            .animate([
              { transform: 'translate(-50%, -50%) scale(1)' },
              { transform: 'translate(-50%, -50%) scale(0.9)' }
            ], ANIMATION_SETTINGS)
            .finished,
        ])
        .then(done);
    };
  });

  return (
    <Portal>
      <Transition onEnter={onEnter()} onExit={onExit()}>
        <Show when={props.show}>
          <div class={classes().root}>
            <dialog class={classes().alert} ref={setDialogRef} open={props.show}>
              <div class={classes().content}>
                <p class={classes().title}>{props.title}</p>
                <Show when={childrenFiltered().usual.length > 0}>
                  <div class={classes().children}>
                    {childrenFiltered().usual}
                  </div>
                </Show>
              </div>

              <div class={classes().actions}>
                <For each={childrenFiltered().boxes}>
                  {({ props, Component }) => {
                    return <Component {...props}/>;
                  }}
                </For>
              </div>
            </dialog>
          </div>
        </Show>
      </Transition>
    </Portal>
  );
}
