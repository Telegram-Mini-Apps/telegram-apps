import type { Component, ParentProps } from 'solid-js';
import { For } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';

import type { ClassNamesMap } from '~/styles/types.js';

import type { RippleData, TransitionEventHandler } from './Ripples.types.js';

interface Props extends ParentProps {
  classes: ClassNamesMap<'content' | 'ripples' | 'ripple'>;
  ripples: RippleData[];
  onTransitionStart: TransitionEventHandler;
  onTransitionEnd: TransitionEventHandler;
}

export const RipplesLayout: Component<Props> = (props) => {
  return (
    <>
      <div class={props.classes.content}>
        {props.children}
      </div>
      <div class={props.classes.ripples}>
        <TransitionGroup name="tgui-ripples__ripple-">
          <For each={props.ripples}>
            {({ size, left, top, id }) => (
              <span
                class={props.classes.ripple}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}px`,
                  top: `${top}px`,
                }}
                data-ripple={id}
                onTransitionStart={props.onTransitionStart}
                onTransitionEnd={props.onTransitionEnd}
              />
            )}
          </For>
        </TransitionGroup>
      </div>
    </>
  );
};
