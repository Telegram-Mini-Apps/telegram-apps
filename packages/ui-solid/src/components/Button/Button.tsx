import { classNames } from '@tma.js/sdk';
import type { Component } from 'solid-js';
import { createMemo, Match, Switch, splitProps } from 'solid-js';

import { withConfig } from '../../providers/index.js';
import { createClasses, styled } from '../../styles/index.js';
import { Loader } from '../Loader/index.js';
import { Typography, type TypographyType } from '../Typography/index.js';
import { mergeWithConfigDefaults } from '../utils.js';

import type { ButtonClassesProps, ButtonProps } from './Button.types.js';
import './Button.scss';

export const ButtonView = styled<ButtonProps, ButtonClassesProps>((props) => {
  const merged = mergeWithConfigDefaults({
    disabled: false,
    fullWidth: false,
    loading: false,
    rounded: false,
    type: 'fill',
    size: 'md',
  } as const, props);
  const [, rest] = splitProps(merged, [
    'fullWidth',
    'loading',
    'rounded',
    'type',
    'colorScheme',
    'classes',
    'platform',
    'size',
  ]);
  const classes = createClasses<ButtonClassesProps>(merged);
  const typographyType = createMemo<TypographyType>(() => {
    return merged.size === 'lg' ? 'text' : 'subheadline2';
  });

  return (
    <button {...rest} class={classNames(props.class, classes.root)}>
      <Switch>
        <Match when={!merged.loading}>
          <Typography type={typographyType()} class={classes.content}>
            {props.children}
          </Typography>
        </Match>
        <Match when={true}>
          <Loader class={classes.loader} size="sm"/>
        </Match>
      </Switch>
    </button>
  );
}, {
  root(props) {
    return [
      'tgui-button',
      `tgui-button--${props.platform}`,
      `tgui-button--${props.platform}-${props.size}`,
      props.fullWidth && 'tgui-button--full-width',
      props.rounded && 'tgui-button--rounded',
    ];
  },
  content(props) {
    return [
      'tgui-button__content',
      `tgui-button__content--${props.platform}-${props.size}`,
    ];
  },
  loader(props) {
    return [
      'tgui-button__loader',
      `tgui-button__loader--${props.platform}-${props.size}`,
    ];
  },
});

export const Button: Component<ButtonProps> = withConfig(ButtonView);
