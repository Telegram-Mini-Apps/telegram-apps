import { Show } from 'solid-js';

import { Typography } from '~/components/Typography/Typography.js';
import { mergeWithConfigDefaults } from '~/components/utils.js';
import { sanitizeProps } from '~/helpers/sanitizeProps.js';
import { withConfig } from '~/hocs/withConfig.js';
import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import type { BadgeProps } from './Badge.types.js';
import './Badge.scss';

const block = new BemBlockClassNames('tgui-badge');

/**
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-·%C2%A0UI-Kit?type=design&node-id=48-396&mode=design&t=wO8NRmLsNTRplvzT-0
 */
export const Badge = withConfig(
  styled((props: BadgeProps) => {
    const merged = mergeWithConfigDefaults({
      size: 'sm',
      variant: 'default',
    } as const, props);
    const classes = createClasses(merged);
    const sanitized = () => {
      const keys: (keyof BadgeProps)[] = ['platform', 'colorScheme', 'classes', 'size', 'variant'];

      // Dot variant cannot display any children.
      if (merged.size === 'dot') {
        keys.push('children');
      }

      return sanitizeProps(merged, ...keys);
    };

    return (
      <Show
        when={merged.size !== 'dot'}
        fallback={<span {...sanitized()} class={classes().root}/>}
      >
        <Typography
          {...sanitized()}
          component="span"
          class={classes().root}
          variant={merged.size === 'sm' ? 'caption1' : 'subheadline2'}
          weight={merged.size === 'sm' ? 'semibold' : undefined}
        >
          {merged.children}
        </Typography>
      </Show>
    );
  }, {
    root: (props) => block.calc({
      mix: props.class,
      mods: [props.size, props.variant],
    }),
  }),
);
