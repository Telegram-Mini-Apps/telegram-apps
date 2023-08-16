import { createEffect, createMemo, createSignal, JSX, Show, splitProps } from 'solid-js';
import { mergeClassNames } from '@twa.js/utils';

import { CreateClasses, WithClasses } from '../../../types';

import styles from './styles.module.scss';
import { ElementContainer } from '../ElementContainer';
import { ElementUnderline } from '../ElementUnderline';

export type TextFieldClassName = 'root' | 'input' | 'placeholder' | 'clear' | 'underline';
export type TextFieldClasses = CreateClasses<TextFieldClassName>;

export interface TextFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement>,
  WithClasses<TextFieldClasses> {
  clear?: boolean;
  onClear?: () => void;
  value?: string;
}

export function TextField(props: TextFieldProps) {
  const [, inputProps] = splitProps(props, ['classes', 'placeholder']);
  const [value, setValue] = createSignal<string>(props.value || '');

  const showPlaceholder = createMemo(() => props.placeholder && value().length === 0);
  const showClear = createMemo<boolean>(() => {
    return value().length > 0 && (typeof props.onClear === 'function' || props.clear === true);
  });

  const onInput = createMemo<JSX.InputEventHandler<HTMLInputElement, InputEvent>>(() => {
    const original = props.onInput;

    return e => {
      setValue(e.target.value);

      if (typeof original === 'function') {
        original(e);
      }
    };
  });

  const onClear = createMemo(() => {
    const original = props.onClear;

    return () => {
      setValue('');

      if (typeof original === 'function') {
        original();
      }
    };
  });

  const classes = createMemo<Required<TextFieldClasses>>(() => {
    return mergeClassNames(styles, props.classes || {}, { root: props.class });
  });

  // Whenever value is changing externally, update local value.
  createEffect(() => {
    if (typeof props.value === 'string') {
      setValue(props.value);
    }
  });

  return (
    <ElementContainer component={'label'} class={classes().root}>
      <ElementUnderline class={classes().underline}>
        <input {...inputProps} value={value()} class={classes().input} onInput={onInput()}/>
        <Show when={showPlaceholder()}>
          <span class={classes().placeholder}>{props.placeholder}</span>
        </Show>
        <Show when={showClear()}>
          <svg
            class={styles.clear}
            viewBox="0 0 17 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClear()}
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.5 17.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zm3.766-12.266a.8.8 0 0 1 0 1.132L9.63 9l2.635 2.634a.8.8 0 1 1-1.132 1.132L8.5 10.13l-2.634 2.635a.8.8 0 1 1-1.132-1.132L7.37 9 4.734 6.366a.8.8 0 0 1 1.132-1.132L8.5 7.87l2.634-2.635a.8.8 0 0 1 1.132 0z"
            />
          </svg>
        </Show>
      </ElementUnderline>
    </ElementContainer>
  );
}