import type { Component } from 'solid-js';
import { on, Show, createMemo, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type { ButtonClassesProps, ButtonProps } from './Button.types.js';

import { Loader, Typography, mergeWithConfigDefaults } from '~components';
import { withConfig } from '~providers';
import { createClasses, styled } from '~styles';

import './Button.scss';

/**
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=45-609&mode=design&t=5uMXzbr5N7vuFjxS-0
 */
export const Button: Component<ButtonProps> = withConfig(
  styled<ButtonProps>((props) => {
    const merged = mergeWithConfigDefaults({
      disabled: false,
      fullWidth: false,
      loading: false,
      rounded: false,
      type: 'fill',
      size: 'md',
      Loader,
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
      'icon',
      'Loader',
    ]);
    const classes = createClasses<ButtonClassesProps>(merged);

    const icon = createMemo(on(
      [() => merged.loading, () => merged.icon, () => merged.Loader],
      ([loading, buttonIcon, LoaderComponent]) => {
        if (loading) {
          return LoaderComponent;
        }
        if (buttonIcon) {
          return typeof buttonIcon === 'function' ? buttonIcon : () => buttonIcon;
        }
      },
    ));

    return (
      <button {...rest} class={classes.root}>
        <Show when={icon()}>
          {(getIcon) => (
            <div class={classes.iconContainer}>
              <Dynamic component={getIcon()} class={classes.icon}/>
            </div>
          )}
        </Show>
        <Show when={props.children}>
          {(children) => (
            <Typography
              type={merged.size === 'lg' ? 'text' : 'subheadline2'}
              class={classes.content}
              weight="semibold"
            >
              {children()}
            </Typography>
          )}
        </Show>
      </button>
    );
  }, {
    root(props) {
      return [
        props.class,
        'tgui-button',
        `tgui-button--${props.type}`,
        `tgui-button--${props.platform}`,
        `tgui-button--${props.platform}-${props.size}`,
        props.fullWidth && 'tgui-button--full-width',
        props.rounded && 'tgui-button--rounded',
      ];
    },
    iconContainer: 'tgui-button__icon-container',
    icon: 'tgui-button__icon',
  }),
);
