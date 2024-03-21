import { For, Show } from 'solid-js';

import { mergeWithConfigDefaults } from '~/components/utils.js';
import { sanitizeProps } from '~/helpers/sanitizeProps.js';
import { withConfig } from '~/hocs/withConfig.js';
import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import type { LoaderProps } from './Loader.types.js';

import './Loader.scss';

const block = new BemBlockClassNames('tgui-loader');

/**
 * Component used to display a pending process.
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=216-2847&mode=design&t=5uMXzbr5N7vuFjxS-0
 */
export const Loader = withConfig(
  styled((props: LoaderProps) => {
    const merged = mergeWithConfigDefaults({ size: 'md' } as const, props);
    const sanitized = sanitizeProps(
      merged,
      'size',
      'colorScheme',
      'platform',
      'classes',
    );
    const classes = createClasses(merged);

    return (
      <div {...sanitized} class={classes().root}>
        <Show
          when={merged.platform === 'ios'}
          fallback={
            <svg class={classes().androidContainer}>
              <circle class={classes().androidCircle} cx="50%" cy="50%" r="50%"/>
            </svg>
          }
        >
          <For each={new Array(8).fill(null)}>
            {(_item, index) => (
              <div
                class={classes().iosLine}
                style={{
                  'animation-delay': `${100 * index()}ms`,
                  transform: `rotate(${45 * index()}deg) translate3d(0, -115%, 0)`,
                }}
              />
            )}
          </For>
        </Show>
      </div>
    );
  }, {
    root: (props) => block.calc({
      mix: props.class,
      mods: [
        props.platform,
        `${props.platform}-${props.size}`,
      ],
    }),
    androidCircle: block.elem('android-circle').calc(),
    androidContainer: block.elem('android-container').calc(),
    iosLine: (props) => {
      return block.elem('ios-line').calc({ mods: props.size });
    },
  }),
);
