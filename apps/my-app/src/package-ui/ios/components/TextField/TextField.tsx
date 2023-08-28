import { createEffect, createMemo, createSignal, JSX, Show, splitProps } from 'solid-js';
import { mergeClassNames } from '@twa.js/utils';

import { createEventHandler } from '../../../createEventHandler.js';
import { Clear } from '../../icons/index.js';
import { withDefault } from '../../styles/index.js';

import type { CreateOptionalClasses, WithClasses } from '../../../types.js';

import styles from './styles.module.scss';

const typedStyles = styles as Required<TextFieldClasses>;

export type TextFieldClassName = 'root' | 'input' | 'placeholder' | 'clear' | 'underline';
export type TextFieldClasses = CreateOptionalClasses<TextFieldClassName>;

export interface TextFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement>, WithClasses<TextFieldClassName> {
  clear?: boolean;

  onClear?(): void;

  value?: string;
}

export function TextField(props: TextFieldProps) {
  const [, inputProps] = splitProps(props, ['classes', 'placeholder']);
  const [value, setValue] = createSignal(props.value || '');

  const showPlaceholder = createMemo<boolean>(() => {
    return Boolean(props.placeholder) && value().length === 0;
  });

  const showClear = createMemo<boolean>(() => {
    return value().length > 0 && (typeof props.onClear === 'function' || props.clear === true);
  });

  const onInput = createEventHandler(() => props.onInput, () => {
    return e => setValue(e.target.value);
  });

  const onClear = createEventHandler(() => props.onClear, () => {
    return () => setValue('');
  });

  const classes = createMemo(() => mergeClassNames(typedStyles, props.classes, {
    root: withDefault(props.class),
  }));

  // Whenever value is changing externally, update local value.
  createEffect(() => {
    if (typeof props.value === 'string') {
      setValue(props.value);
    }
  });

  return (
    <label class={classes().root}>
      <input {...inputProps} value={value()} class={classes().input} onInput={onInput()}/>
      <Show when={showPlaceholder()}>
        <span class={classes().placeholder}>{props.placeholder}</span>
      </Show>
      <Show when={showClear()}>
        <Clear class={styles.clear} onClick={onClear()}/>
      </Show>
    </label>
  );
}