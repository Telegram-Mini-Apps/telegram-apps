import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { mergeWithConfigDefaults } from '~components/utils.js';
import { createClasses } from '~styles/createClasses.js';

import type { TypographyProps } from './Typography.types.js';

import { withConfig } from '~providers/ConfigProvider/ConfigProvider.context.js';
import { styled } from '~styles/styled.js';

import './Typography.scss';

/**
 * Component used for any typography-related functionality.
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=216-1907&mode=design&t=nUrQwsUgG6ktNuOf-0
 */
export const Typography = withConfig(
  styled<TypographyProps>((props) => {
    const merged = mergeWithConfigDefaults({
      type: 'text',
      weight: 'regular',
      as: 'p',
      monospace: false,
    } as const, props);
    const [, rest] = splitProps(merged, [
      'as',
      'type',
      'weight',
      'platform',
      'colorScheme',
      'classes',
      'monospace',
    ]);

    return <Dynamic {...rest} component={merged.as} class={createClasses(merged).root}/>;
  }, {
    root(props) {
      return [
        props.class,
        'tgui-typography',
        `tgui-typography--${props.weight}`,
        `tgui-typography--${props.type}`,
        `tgui-typography--${props.platform}`,
        `tgui-typography--${props.platform}-${props.type}`,
        props.monospace && `tgui-typography--${props.platform}-monospace`,
      ];
    },
  }),
);
