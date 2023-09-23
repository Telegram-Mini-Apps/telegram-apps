import { createMemo, createSignal, JSX, splitProps } from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import { createHandler } from '../../../createHandler.js';
import { safePostEvent } from '../../../safePostEvent.js';
import { withDefault } from '../../styles/globals.js';

import type { CreateClasses, WithClasses } from '../../../types.js';

import styles from './styles.module.scss';

const typedStyles = styles as Required<SwitchClasses>;

export type SwitchClassName = 'root' | 'rootChecked' | 'input' | 'track';
export type SwitchClasses = CreateClasses<SwitchClassName>;

export interface SwitchProps extends JSX.InputHTMLAttributes<HTMLInputElement>,
  WithClasses<SwitchClassName> {
}

export function Switch(props: SwitchProps) {
  const [checked, setChecked] = createSignal(props.checked || false);
  const classes = createMemo(() => {
    const { root, rootChecked, ...rest } = mergeClassNames(typedStyles, props.classes);

    return {
      ...rest,
      root: withDefault(root, props.class, { [rootChecked]: checked() }),
    };
  });

  const onChange = createHandler(() => props.onChange, () => {
    return e => {
      safePostEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'light' });
      setChecked(e.target.checked);
    };
  });

  const [, inputProps] = splitProps(props, ['classes']);

  return (
    <label class={classes().root}>
      <input
        {...inputProps}
        class={classes().input}
        checked={checked()}
        type="checkbox"
        onChange={onChange()}
      />
      <i class={classes().track}/>
    </label>
  );
}
