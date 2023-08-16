import { createMemo, createSignal, JSX, splitProps } from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import { CreateClasses, WithClasses } from '../../../types';
import { createHandler } from '../../../createHandler';

import styles from './styles.module.scss';

type Styles = Required<SwitchClasses>;

export type SwitchClassName = 'root' | 'rootChecked' | 'input' | 'track';
export type SwitchClasses = CreateClasses<SwitchClassName>;

export interface SwitchProps extends JSX.InputHTMLAttributes<HTMLInputElement>,
  WithClasses<SwitchClasses> {
}

export function Switch(props: SwitchProps) {
  const [checked, setChecked] = createSignal<boolean>(props.checked || false);

  const mergedClasses = createMemo<Styles>(() => mergeClassNames(styles, props.classes));
  const classes = createMemo(() => {
    const { root, rootChecked, ...rest } = mergedClasses();

    return {
      ...rest,
      root: classNames(root, props.class, {
        [rootChecked]: checked(),
      }),
    };
  });

  const onChange = createHandler(() => props.onChange, e => setChecked(e.target.checked));

  const [, inputProps] = splitProps(props, ['classes']);

  return (
    <label class={classes().root}>
      <input {...inputProps} class={classes().input} type="checkbox" onChange={onChange()}/>
      <i class={classes().track}/>
    </label>
  );
}
