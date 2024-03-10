import { classNames } from '@tma.js/sdk';
import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { withConfig } from '../../providers/index.js';
import { createClasses, styled } from '../../styles/index.js';
import { mergeWithConfigDefaults } from '../utils.js';

import type { TypographyProps } from './Typography.types.js';

import './Typography.scss';

/**
 * Component used for any typography-related functionality.
 * @see https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=216-1907&mode=design&t=nUrQwsUgG6ktNuOf-0
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
    const classes = createClasses(merged);

    return (
      <Dynamic
        {...rest}
        component={merged.as}
        class={classNames(classes.root, merged.class)}
      />
    );
  }, {
    root(props) {
      return [
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
