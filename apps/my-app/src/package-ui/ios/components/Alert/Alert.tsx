import { createMemo, JSX, ParentProps } from 'solid-js';
import { mergeClassNames } from '@twa.js/utils';

import type { CreateClasses, WithClasses } from '../../../types.js';

import styles from './styles.module.scss';

const typedStyles = styles as Required<AlertClasses>;

export type AlertClassName = 'root' | 'alert' | 'title' | 'content';
export type AlertClasses = CreateClasses<AlertClassName>;

export interface AlertProps extends ParentProps, Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'>,
  WithClasses<AlertClasses> {
  title: string;
}

/**
 * @see https://www.figma.com/file/skT2zRtPpWWu603vK9mk1V/iOS-16-UI-Kit-for-Figma-(Community)?node-id=9%3A1331&mode=dev
 */
export function Alert(props: AlertProps) {
  const classes = createMemo(() => mergeClassNames(typedStyles, props.classes));

  return (
    <div class={classes().root}>
      <div class={classes().alert}>
        <p class={classes().title}>{props.title}</p>
        <div class={classes().content} />
      </div>
    </div>
  );
}