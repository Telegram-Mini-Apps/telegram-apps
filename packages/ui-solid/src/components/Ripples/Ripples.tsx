import type { JSXElement, JSX } from 'solid-js';
import { createEffect, onCleanup, For, createSignal, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { TransitionGroup } from 'solid-transition-group';

import type { RipplesComponent, RipplesProps } from '~/components/Ripples/Ripples.types.js';
import { mergeWithConfigDefaults } from '~/components/utils.js';
import { sanitizeProps } from '~/helpers/sanitizeProps.js';
import { withConfig } from '~/hocs/withConfig.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import './Ripples.scss';

interface Ripple {
  id: string;
  size: number;
  left: number;
  top: number;
}

type PointerEventHandler = JSX.EventHandler<HTMLElement, PointerEvent>;
type TransitionEventHandler = JSX.EventHandlerUnion<HTMLSpanElement, TransitionEvent>;

export const Ripples = withConfig(
  styled((props: RipplesProps<RipplesComponent>) => {
    const merged = mergeWithConfigDefaults({
      component: 'div',
      centered: false,
      disable: false,
      overlay: false,
    } as const, props);
    const classes = createClasses(merged);
    const sanitized = sanitizeProps(
      props,
      'component',
      'centered',
      'disable',
      'colorScheme',
      'platform',
      'classes',
      'overlay',
    );

    // Last transitioning ripple identifier.
    const [transitioningRipple, setTransitioningRipple] = createSignal<string | undefined>();

    // Currently active ripple identifier. We consider ripple as active in case, user holds
    // the pointer down on the element.
    const [activeRipple, setActiveRipple] = createSignal<string | undefined>();

    // List of ripples to be displayed.;
    const [ripples, setRipples] = createSignal<Ripple[]>([]);

    // Drops active ripple/
    const dropActiveRipple = () => setActiveRipple();

    // Removes ripple with speicifed identifier.
    const removeRipple = (id: string) => {
      setRipples((prevRipples) => {
        return prevRipples.filter((r) => r.id !== id);
      });
    };

    // Pointer leave handler which drops active ripple/
    const onPointerLeave: PointerEventHandler = (e) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      merged.onPointerLeave && (merged as any).onPointerLeave(e);

      dropActiveRipple();
    };

    // Pointer down handler which adds new ripple.
    const onPointerDown: PointerEventHandler = (e) => {
      const {
        disable,
        onPointerDown: propsOnPointerDown,
      } = merged;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      propsOnPointerDown && (propsOnPointerDown as any)(e);
      if (disable) {
        return;
      }

      const {
        currentTarget,
        clientX,
        clientY,
      } = e;
      const {
        width,
        height,
        left,
        top,
      } = currentTarget.getBoundingClientRect();
      const {
        radius = Math.max(width, height) * 1.5,
        centered,
      } = merged;

      const id = Math.random().toString();
      const ripple = {
        id,
        size: radius * 2,
        left: centered ? (width / 2) : (clientX - left) - radius,
        top: centered ? (height / 2) : (clientY - top) - radius,
      };
      setActiveRipple(id);
      setRipples((prevRipples) => [...prevRipples, ripple]);
    };

    // Ripple transition start handler.
    const onTransitionStart: TransitionEventHandler = (e) => {
      // In case, transition was "transform", it means, that ripple just appeared. At this
      // moment, we consider this ripple as started its transition.
      if (e.propertyName === 'transform') {
        setTransitioningRipple(e.currentTarget.dataset.ripple!);
      }
    };

    // Ripple transition end handler.
    const onTransitionEnd: TransitionEventHandler = (e) => {
      const ripple = e.currentTarget.dataset.ripple!;

      // Active ripples can't be removed even when transition has just ended. So, if
      // current ripple is not the active one, we can safely remove it.
      if (activeRipple() !== ripple) {
        removeRipple(ripple);
      }

      // We drop transitioning ripple only in case, it is the last one registered transitioning.
      // The reason is user could press the component 2 times. The transitioning ripple will be
      // the last one added, but transitionend event of the 1-st element will be fired before
      // the event of the 2-nd ripple. So, not comparing current ripple with the transitioning
      // one will lead to errors as long as we will still have the 2-nd ripple transitioning at
      // this time.
      setTransitioningRipple((prevRipple) => {
        return prevRipple === ripple ? undefined : prevRipple;
      });
    };

    // When user releases the pointer everywhere in the document, we should drop the active ripple.
    // It covers the case, when user pressed the root element and moved his cursor away from it.
    createEffect(() => {
      window.addEventListener('pointerup', dropActiveRipple);
      onCleanup(() => {
        window.removeEventListener('pointerup', dropActiveRipple);
      });
    });

    // When we met a case, when active ripple became inactive, and we currently have no
    // transitioning ripples, we should remove it. This effect covers the case, when user
    // pressed the element and held the pointer down for some time. When ripple transition
    // ends, we can't remove it, because user should still see it. We mark this ripple as ended
    // its transition and wait for it to lose the active status.
    createEffect<string | undefined>((prevActive) => {
      const active = activeRipple();

      if (prevActive && !active && !transitioningRipple()) {
        removeRipple(prevActive);
      }

      return active;
    });

    return (
      <Dynamic
        component={merged.component}
        {...sanitized}
        class={classes().root}
        onPointerDown={onPointerDown}
        onPointerLeave={onPointerLeave}
      >
        <div class={classes().content}>
          {props.children}
        </div>
        <Show when={ripples()}>
          <div class={classes().ripples}>
            <TransitionGroup name="tgui-ripples__ripple-">
              <For each={ripples()}>
                {({ size, left, top, id }) => (
                  <span
                    class={classes().ripple}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      left: `${left}px`,
                      top: `${top}px`,
                    }}
                    data-ripple={id}
                    onTransitionStart={onTransitionStart}
                    onTransitionEnd={onTransitionEnd}
                  />
                )}
              </For>
            </TransitionGroup>
          </div>
        </Show>
      </Dynamic>
    );
  }, {
    root(props) {
      return [props.class, 'tgui-ripples'];
    },
    ripple: 'tgui-ripples__ripple',
    ripples: 'tgui-ripples__ripples',
    content(props) {
      return [
        'tgui-ripples__content',
        props.overlay && 'tgui-ripples__content--overlay',
      ];
    },
  }),
) as <Cmp extends RipplesComponent>(props: RipplesProps<Cmp>) => JSXElement;
