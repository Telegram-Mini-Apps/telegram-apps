import { createMemo, For, JSX } from 'solid-js';
import { mergeClassNames } from '@twa.js/utils';

import type { WithClasses, CreateRequiredClasses, CreateOptionalClasses } from '../../../types.js';

import styles from './styles.module.scss';

const typedStyles = styles as CreateRequiredClasses<SpinnerClassName>;

export type SpinnerClassName = 'root' | 'blade' | 'inner';

export type SpinnerClasses = CreateOptionalClasses<SpinnerClassName>;

export interface SpinnerProps extends JSX.HTMLAttributes<HTMLDivElement>,
  WithClasses<SpinnerClassName> {
  /**
   * Spinner size in pixels.
   * @default 30
   */
  size?: number;
}

export function Spinner(props: SpinnerProps) {
  const size = () => `${props.size || 30}px`;
  const classes = createMemo(() => mergeClassNames(typedStyles, props.classes, { root: props.class }));

  return (
    <div class={classes().root} style={{ width: size(), height: size(), 'font-size': size() }}>
      <div class={classes().inner}>
        <For each={new Array(12).fill(null)}>
          {() => <div class={classes().blade}/>}
        </For>
      </div>
    </div>
  );
}