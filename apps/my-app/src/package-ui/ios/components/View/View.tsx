import { createMemo, JSX, ParentProps } from 'solid-js';
import { mergeClassNames } from '@twa.js/utils';

import type { CreateRequiredClasses, WithClasses } from '../../../types.js';

import styles from './styles.module.scss';

export type ViewClassName = 'root';

export interface ViewProps extends JSX.HTMLAttributes<HTMLDivElement>, ParentProps, WithClasses<ViewClassName> {
}

const typedStyles = styles as CreateRequiredClasses<ViewClassName>;

export function View(props: ViewProps) {
  const classes = createMemo(() => mergeClassNames(typedStyles, props.classes, {
    root: props.class,
  }));

  return <div {...props} class={classes().root}/>;
}