import { Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { Loader } from '~/components/Loader/Loader.js';
import { Ripples } from '~/components/Ripples/Ripples.js';
import { Typography } from '~/components/Typography/Typography.js';
import { mergeWithConfigDefaults } from '~/components/utils.js';
import { sanitizeProps } from '~/helpers/sanitizeProps.js';
import { slotToComponent } from '~/helpers/slotToComponent.js';
import { withConfig } from '~/hocs/withConfig.js';
import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import type { ButtonProps } from './Button.types.js';

import './Button.scss';

const block = new BemBlockClassNames('tgui-button');

/**
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=45-609&mode=design&t=5uMXzbr5N7vuFjxS-0
 */
export const Button = withConfig(
  styled((props: ButtonProps) => {
    const merged = mergeWithConfigDefaults({
      disabled: false,
      stretched: false,
      loading: false,
      rounded: false,
      variant: 'fill',
      size: 'md',
    } as const, props);
    const sanitized = sanitizeProps(
      merged,
      'after',
      'before',
      'stretched',
      'loading',
      'rounded',
      'variant',
      'colorScheme',
      'classes',
      'platform',
      'size',
      'icon',
    );
    const classes = createClasses(merged);

    const icon = () => {
      const buttonIcon = merged.icon;
      const loading = merged.loading;

      return loading
        ? (iconProps: { class?: string }) => <Loader class={iconProps.class} size="sm"/>
        : slotToComponent(buttonIcon);
    };

    const before = () => slotToComponent(merged.before);

    const after = () => slotToComponent(merged.after);

    return (
      <Ripples
        {...sanitized}
        component="button"
        classes={{
          content: [
            'tgui-button__ripples',
            `tgui-button__ripples--${merged.variant}`,
            `tgui-button__ripples--${merged.platform}`,
            `tgui-button__ripples--${merged.platform}-${merged.size}`,
          ],
          ripple: [
            // 'tgui-button__ripple',
            `tgui-button__ripple--${merged.variant}`,
          ],
        }}
        class={classes().root}
        disable={merged.disabled || (
          typeof merged.ripples === 'boolean'
            ? !merged.ripples
            : merged.platform === 'ios'
        )}
      >
        <Show when={icon()}>
          {(getIcon) => (
            <div class={classes().iconContainer}>
              <Dynamic component={getIcon()} class={classes().icon}/>
            </div>
          )}
        </Show>
        <Show when={before()}>
          {(getBefore) => (
            <div class={classes().before}>
              <Dynamic component={getBefore()}/>
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
        <Show when={after()}>
          {(getAfter) => (
            <div class={classes().after}>
              <Dynamic component={getAfter()}/>
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
