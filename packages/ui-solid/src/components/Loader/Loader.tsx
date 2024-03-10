import { For, splitProps, Show } from 'solid-js';

import { withConfig } from '../../providers/index.js';
import { createClasses, styled } from '../../styles/index.js';
import { mergeWithConfigDefaults } from '../utils.js';

import type { LoaderProps } from './Loader.types.js';

import './Loader.scss';

/**
 * Component used to display a pending process.
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=216-2847&mode=design&t=5uMXzbr5N7vuFjxS-0
 */
export const Loader = withConfig(
  styled<LoaderProps>((props) => {
    const merged = mergeWithConfigDefaults({ size: 'md' } as const, props);
    const [, rest] = splitProps(merged, [
      'size',
      'colorScheme',
      'platform',
      'classes',
    ]);
    const classes = createClasses(merged);

    return (
      <div {...rest} class={classes.root}>
        <Show
          when={merged.platform === 'ios'}
          fallback={
            <svg class={classes.androidContainer}>
              <circle class={classes.androidCircle} cx="50%" cy="50%" r="50%"/>
            </svg>
          }
        >
          <For each={new Array(8).fill(null)}>
            {(_item, index) => (
              <div
                class={classes.iosLine}
                style={{
                  'animation-delay': `${100 * index()}ms`,
                  'transform-origin': 'center',
                  transform: `rotate(${45 * index()}deg) translate3d(0, -115%, 0)`,
                }}
              />
            )}
          </For>
        </Show>
      </div>
    );
  }, {
    root(props) {
      return [
        props.class,
        'tgui-loader',
        `tgui-loader--${props.platform}`,
        `tgui-loader--${props.platform}-${props.size}`,
      ];
    },
    androidContainer: 'tgui-loader__android-container',
    iosLine(props) {
      return [
        'tgui-loader__ios-line',
        `tgui-loader__ios-line--${props.size}`,
      ];
    },
  }),
);
