import { type JSX, createMemo, splitProps } from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import { withDefault } from '../../styles/index.js';

import type { CreateOptionalClasses, CreateRequiredClasses, WithClasses } from '../../../types.js';

import styles from './styles.module.scss';

const typedStyles = styles as CreateRequiredClasses<ButtonClassName>;

export type ButtonClassName = 'root' | 'rootPlain';

export type ButtonClasses = CreateOptionalClasses<ButtonClassName>;

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement>,
  WithClasses<ButtonClassName> {
  variant?: 'plain';
}

export function Button(props: ButtonProps) {
  const classes = createMemo(() => {
    const { root, rootPlain, ...rest } = mergeClassNames(props.classes, typedStyles, {
      root: withDefault(props.class),
    });
    const variant = props.variant || 'plain';

    return {
      ...rest,
      root: classNames(root, { [rootPlain]: variant === 'plain' }),
    };
  });
  const [, restProps] = splitProps(props, ['classes', 'variant']);

  return <button {...restProps} class={classes().root}/>;
}