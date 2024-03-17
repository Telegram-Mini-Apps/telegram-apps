import type { JSXElement } from 'solid-js';
import { For, createMemo, createSignal, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type {
  OnPointerDown,
  RipplesComponent,
  RipplesProps,
} from '~/components/Ripples/Ripples.types.js';
import { mergeWithConfigDefaults } from '~/components/utils.js';
import { sanitizeProps } from '~/helpers/sanitizeProps.js';
import { withConfig } from '~/hocs/withConfig.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import './Ripples.scss';

export const Ripples = withConfig(
  styled((props: RipplesProps<RipplesComponent>) => {
    const merged = mergeWithConfigDefaults({
      component: 'div',
      centered: false,
      disabled: false,
      overlay: false,
    } as const, props);
    const classes = createClasses(merged as any);
    const sanitized = createMemo(() => {
      const keys: (keyof RipplesProps<RipplesComponent>)[] = [
        'component',
        'centered',
        'disabled',
        'colorScheme',
        'platform',
        'classes',
        'overlay',
      ];
      if (props.component !== 'button') {
        keys.push('disabled');
      }
      return sanitizeProps(props, ...keys);
    });

    const [ripples, setRipples] = createSignal<{
      size: number;
      left: number;
      top: number;
    }[]>([]);

    const removeRipple = () => {
      setRipples((prevRipples) => prevRipples.slice(1));
    };

    const onPointerDown = createMemo<OnPointerDown>(() => {
      const propsRadius = merged.radius;
      const propsOnPointerDown = props.onPointerDown;
      const propsDisabled = merged.disabled;
      const propsCentered = merged.centered;

      return (event) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        propsOnPointerDown && (propsOnPointerDown as any)(event);
        if (propsDisabled) {
          return;
        }

        const {
          currentTarget,
          clientX,
          clientY,
        } = event;
        const {
          width,
          height,
          left,
          top,
        } = currentTarget.getBoundingClientRect();
        const radius = propsRadius || (Math.max(width, height) / 2);

        setRipples((prevRipples) => [...prevRipples, {
          size: radius * 2,
          left: (propsCentered ? (height / 2) : (clientX - left)) - radius,
          top: (propsCentered ? (width / 2) : (clientY - top)) - radius,
        }]);
      };
    });

    return (
      <Dynamic
        component={merged.component}
        {...sanitized}
        class={classes().root}
        onPointerDown={onPointerDown()}
      >
        <div class={classes().content}>
          {props.children}
        </div>
        <Show when={ripples().length}>
          <div class={classes().ripples}>
            <For each={ripples()}>
              {({ size, left, top }) => (
                <span
                  class={classes().ripple}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}px`,
                    top: `${top}px`,
                  }}
                  onAnimationEnd={removeRipple}
                />
              )}
            </For>
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
