import { classNames } from '@tma.js/sdk';
import { Switch, Match, For, splitProps } from 'solid-js';
import type { Component } from 'solid-js';

import { withConfig } from '../../providers/index.js';
import { createClasses, styled } from '../../styles/index.js';
import { mergeWithConfigDefaults } from '../utils.js';

import type { LoaderClassesProps, LoaderProps } from './Loader.types.js';

import './Loader.scss';

export const LoaderView = styled<LoaderProps, LoaderClassesProps>((props) => {
  const merged = mergeWithConfigDefaults({ size: 'md' } as const, props);
  const [, rest] = splitProps(merged, ['size', 'colorScheme', 'platform', 'classes']);
  const classes = createClasses<LoaderClassesProps>(merged);

  return (
    <Switch>
      <Match when={merged.platform === 'ios'}>
        <div {...rest} class={classNames(classes.root, merged.class)}>
          <For each={new Array(8).fill(null)}>
            {(_item, index) => (
              <div
                class={classes.inner}
                style={{
                  'animation-delay': `${100 * index()}ms`,
                  transform: `rotate(${45 * index()}deg) translate3d(0, -60%, 0)`,
                }}
              />
            )}
          </For>
        </div>
      </Match>
      <Match when={true}>
        {/* FIXME rest props */}
        <svg class={classNames(classes.root, merged.class)}>
          <circle class={classes.inner} cx="50%" cy="50%" r="50%"/>
        </svg>
      </Match>
    </Switch>
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
  inner(props) {
    return [
      // 'tgui-loader__inner',
      props.platform && `tgui-loader__inner--${props.platform}`,
      `tgui-loader__inner--${props.platform}-${props.size}`,
    ];
  },
});

export const Loader: Component<LoaderProps> = withConfig(LoaderView);
