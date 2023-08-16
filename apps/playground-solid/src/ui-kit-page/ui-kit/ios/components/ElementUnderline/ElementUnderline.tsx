import { createMemo, JSX } from 'solid-js';
import { mergeClassNames } from '@twa.js/utils';

import { CreateClasses, WithClasses } from '../../types';

import styles from './styles.module.scss';

export type ElementUnderlineClassName = 'root' | 'divider';
export type ElementUnderlineClasses = CreateClasses<ElementUnderlineClassName>;

export interface ElementUnderlineProps extends JSX.HTMLAttributes<HTMLDivElement>,
  WithClasses<ElementUnderlineClasses> {
}

export function ElementUnderline(props: ElementUnderlineProps) {
  const classes = createMemo<Required<ElementUnderlineClasses>>(() => {
    return mergeClassNames(styles, props.classes || {}, { root: props.class });
  });

  return (
    <div {...props} class={classes().root}>
      <div class={classes().divider}/>
      {props.children}
    </div>
  );
}