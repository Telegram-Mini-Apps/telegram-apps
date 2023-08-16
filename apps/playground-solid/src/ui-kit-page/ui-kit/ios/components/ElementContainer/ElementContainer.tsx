import { createMemo, JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { mergeClassNames } from '@twa.js/utils';

import { CreateClasses, WithClasses } from '../../types';

import styles from './styles.module.scss';

export type ElementContainerClassName = 'root' | 'divider';
export type ElementContainerClasses = CreateClasses<ElementContainerClassName>;

export interface ElementContainerProps extends JSX.HTMLAttributes<HTMLDivElement>,
  WithClasses<ElementContainerClasses> {
  component?: keyof JSX.HTMLElementTags;
}

export function ElementContainer(props: ElementContainerProps) {
  const classes = createMemo<Required<ElementContainerClasses>>(() => {
    return mergeClassNames(styles, props.classes || {}, { root: props.class });
  });

  return (
    <Dynamic {...props} component={props.component || 'div'} class={classes().root}>
      {props.children}
    </Dynamic>
  );
}