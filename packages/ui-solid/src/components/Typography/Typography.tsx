import type { JSXElement } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { mergeWithConfigDefaults } from '~/components/utils.js';
import { sanitizeProps } from '~/helpers/sanitizeProps.js';
import { withConfig } from '~/hocs/withConfig.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import type { TypographyComponent, TypographyProps } from './Typography.types.js';

import './Typography.scss';

/**
 * Component used for any typography-related functionality.
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=216-1907&mode=design&t=nUrQwsUgG6ktNuOf-0
 */
export const Typography = withConfig(
  styled((props: TypographyProps<TypographyComponent>) => {
    const merged = mergeWithConfigDefaults({
      type: 'text',
      weight: 'regular',
      component: 'p',
      monospace: false,
    } as const, props);
    const sanitized = sanitizeProps(
      merged,
      'component',
      'type',
      'weight',
      'platform',
      'colorScheme',
      'classes',
      'monospace',
    );

    return (
      <Dynamic
        {...sanitized}
        component={merged.component}
        class={createClasses(merged as any).root}
      />
    );
  }, {
    root(props) {
      return [
        (props as any).class,
        'tgui-typography',
        `tgui-typography--${props.weight}`,
        `tgui-typography--${props.variant}`,
        `tgui-typography--${props.platform}`,
        `tgui-typography--${props.platform}-${props.variant}`,
        props.monospace && `tgui-typography--${props.platform}-monospace`,
      ];
    },
  }),
) as <Cmp extends TypographyComponent>(props: TypographyProps<Cmp>) => JSXElement;
