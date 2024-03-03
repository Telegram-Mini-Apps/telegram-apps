import { For, Match, mergeProps, Switch } from 'solid-js';

import { createClasses, styled } from '../../styles/index.js';

import type { LoaderClassesProps, LoaderViewProps } from './Loader.types.js';

import './Loader.css';

export const LoaderView = styled<LoaderViewProps, LoaderClassesProps>((props) => {
  const classes = createClasses(
    mergeProps({
      size: 'md',
      colorScheme: 'light',
      platform: 'base',
    } as const, props),
  );

  return (
    <Switch>
      <Match when={props.platform === 'ios'}>
        <div class={classes.root}>
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
        <svg class={classes.root}>
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
      'tgui-loader__inner',
      `tgui-loader__inner--${props.platform}`,
      `tgui-loader__inner--${props.platform}-${props.size}`,
    ];
  },
});
