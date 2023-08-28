import { createMemo, splitProps } from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import { withDefault } from '../../styles/index.js';

import type { AlertItemClasses, AlertItemProps } from './AlertItem.js';

import styles from './styles.module.scss';

const typedStyles = styles as Required<AlertItemClasses>;

export interface AlertItemViewProps extends AlertItemProps {
}

export function AlertItemView(props: AlertItemViewProps) {
  const [, rootProps] = splitProps(props, ['title', 'classes', 'variant', 'children']);
  const classes = createMemo(() => {
    const {
      root,
      rootVariantSecondary,
      rootVariantPrimary,
      ...rest
    } = mergeClassNames(typedStyles, props.classes, { root: withDefault(props.class) });
    const variant = props.variant || 'secondary';

    return {
      ...rest,
      root: classNames(root, {
        [rootVariantPrimary]: variant === 'primary',
        [rootVariantSecondary]: variant === 'secondary',
      }),
    };
  });

  return <div {...rootProps} class={classes().root}>{props.title}</div>;
}