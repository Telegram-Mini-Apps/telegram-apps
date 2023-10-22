import { useSDK } from '@tma.js/sdk-solid';
import { A } from '@solidjs/router';
import { createMemo, For, Match, Switch } from 'solid-js';
import type { RGB } from '@tma.js/colors';

import styles from './styles.module.css';

interface ParamLineProps {
  title: string;
  color: RGB | null;
}

function ParamLine(props: ParamLineProps) {
  return (
    <div class={styles.line}>
      <div class={styles.title}>{props.title}</div>
      <Switch>
        <Match when={props.color === null}>
          <i>No data</i>
        </Match>
        <Match when={props.color !== null}>
          <div class={styles.colorWrapper}>
            <div class={styles.color} style={{ 'background-color': props.color! }}/>
            {props.color}
          </div>
        </Match>
      </Switch>
    </div>
  );
}

export function ThemeParamsPage() {
  const { themeParams } = useSDK();
  const lines = createMemo<ParamLineProps[]>(() => {
    const {
      backgroundColor,
      buttonColor,
      linkColor,
      secondaryBackgroundColor,
      textColor,
      buttonTextColor,
      hintColor,
    } = themeParams();

    return [
      { title: 'Background color', color: backgroundColor },
      { title: 'Button background color', color: buttonColor },
      { title: 'Button text color', color: buttonTextColor },
      { title: 'Link color', color: linkColor },
      { title: 'Secondary background color', color: secondaryBackgroundColor },
      { title: 'Text color', color: textColor },
      { title: 'Hint color', color: hintColor },
    ];
  });

  return (
    <>
      <For each={lines()}>
        {line => <ParamLine {...line}/>}
      </For>
      <A class={styles.back} href="/init-data">
        To init data
      </A>
    </>
  );
}