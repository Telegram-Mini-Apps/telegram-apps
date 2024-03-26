import { mergeProps, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { sanitizeCommon } from '~/helpers/sanitizeCommon.js';
import { slotToComponent } from '~/helpers/slotToComponent.js';
import { withConfig } from '~/hocs/withConfig.js';
import type { WithConfigComponent } from '~/hocs/withConfig.js';

import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import { Loader } from '~/components/Loader/Loader.js';
import { Ripples } from '~/components/Ripples/Ripples.js';
import { Typography } from '~/components/Typography/Typography.js';

import type { ButtonDefaults, ButtonProps } from './Button.types.js';

import './Button.scss';

const block = new BemBlockClassNames('tgui-button');

/**
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=45-609&mode=design&t=5uMXzbr5N7vuFjxS-0
 */
export const Button: WithConfigComponent<ButtonProps> = withConfig(
  styled((props: ButtonProps) => {
    const merged = mergeProps({
      disabled: false,
      stretched: false,
      loading: false,
      rounded: false,
      variant: 'fill',
      size: 'md',
    } satisfies Required<ButtonDefaults>, props);
    const classes = createClasses(merged);

    const icon = () => (
      merged.loading
        ? (iconProps: { class?: string }) => <Loader class={iconProps.class} size="sm"/>
        : slotToComponent(merged.icon)
    );

    return (
      <Ripples
        {...sanitizeCommon(merged, [
          'after',
          'before',
          'stretched',
          'loading',
          'rounded',
          'variant',
          'size',
          'icon',
        ])}
        component="button"
        disable={merged.disabled || (
          typeof merged.ripples === 'boolean'
            ? !merged.ripples
            : merged.platform === 'ios'
        )}
        classes={{
          content: [
            'tgui-button__ripples',
            `tgui-button__ripples--${merged.variant}`,
            `tgui-button__ripples--${merged.platform}`,
            `tgui-button__ripples--${merged.platform}-${merged.size}`,
          ],
          ripple: `tgui-button__ripple--${merged.variant}`,
        }}
        class={classes().root}
      >
        <Show when={icon()}>
          {(getIcon) => (
            <div class={classes().iconContainer}>
              <Dynamic component={getIcon()} class={classes().icon}/>
            </div>
          )}
        </Show>
        <Show when={slotToComponent(merged.before)}>
          {(before) => (
            <div class={classes().before}>
              <Dynamic component={before()}/>
            </div>
          )}
        </Show>
        <Show when={merged.children}>
          {(children) => (
            <Typography
              variant={props.size === 'lg' ? 'text' : 'subheadline2'}
              class={classes().content}
              weight="semibold"
            >
              {children()}
            </Typography>
          )}
        </Show>
        <Show when={slotToComponent(merged.after)}>
          {(after) => (
            <div class={classes().after}>
              <Dynamic component={after()}/>
            </div>
          )}
        </Show>
      </Ripples>
    );
  }, {
    root: (props) => block.calc({
      mix: props.class,
      mods: [
        props.variant,
        props.platform,
        `${props.platform}-${props.variant}`,
        `${props.platform}-${props.size}`,
        props.stretched && 'stretched',
        props.rounded && 'rounded',
        props.disabled && 'disabled',
      ],
    }),
    iconContainer: block.elem('icon-container').calc(),
    icon: block.elem('icon').calc(),
  }),
);
