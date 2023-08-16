import { createMemo } from 'solid-js';

import styles from './styles.module.scss';

export interface TextFieldProps {
  value?: string;

  onChange?(value: string): void;
}

export function TextFieldIOS(props: TextFieldProps) {
  const onChange = createMemo(() => {
    const propsOnChange = props.onChange;

    return (e: { target: HTMLInputElement }) => {
      if (propsOnChange) {
        propsOnChange(e.target.value);
      }
    };
  });

  return (
    <label class={styles.root}>
      <input onChange={onChange}/>
    </label>
  );
}