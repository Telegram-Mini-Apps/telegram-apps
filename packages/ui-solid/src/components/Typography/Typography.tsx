import { classNames } from '@tma.js/sdk';
import { splitProps } from 'solid-js';
import type { Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { withConfig } from '../../providers/index.js';
import { createClasses, styled } from '../../styles/index.js';
import { mergeWithConfigDefaults } from '../utils.js';

import type { TypographyClassesProps, TypographyProps } from './Typography.types.js';

import './Typography.scss';

export const TypographyView = styled<TypographyProps, TypographyClassesProps>((props) => {
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
      props.monospace && `tgui-typography--${props.platform}-monospace`,
      `tgui-typography--${props.weight}`,
      `tgui-typography--${props.platform}`,
      `tgui-typography--${props.type}`,
      `tgui-typography--${props.platform}-${props.type}`,
    ];
  },
});

export const Typography: Component<TypographyProps> = withConfig(TypographyView);
