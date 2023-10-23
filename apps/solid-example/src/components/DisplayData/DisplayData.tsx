import { For, Match, Switch } from 'solid-js';
import { isRGB, type RGB } from '@tma.js/colors';

import styles from './styles.module.css';

type LineValue = string | null | Line[];
export type Line = [title: string, value: LineValue];

interface DisplayDataProps {
  title: string;
  lines: Line[];
}

interface DataLineProps {
  title: string;
  value: LineValue;
}

interface DisplayRGBProps {
  color: RGB;
}

function DisplayRGB(props: DisplayRGBProps) {
  return (
    <div class={styles.colorWrapper}>
      <div
        class={styles.color}
        style={{ 'background-color': props.color }}
      />
      {props.color}
    </div>
  );
}

function DataLine(props: DataLineProps) {
  return (
    <div class={styles.line}>
      <Switch>
        <Match when={Array.isArray(props.value) ? props.value : false}>
          {(lines) => <DisplayData title={props.title} lines={lines()}/>}
        </Match>
        <Match when={true}>
          <div class={styles.lineTitle}>
            {props.title}
          </div>
          <div class={styles.lineValue}>
            <code>
              <Switch fallback={<i>No data</i>}>
                <Match
                  when={typeof props.value === 'string' && isRGB(props.value) ? props.value : false}
                >
                  {(rgb) => <DisplayRGB color={rgb()}/>}
                </Match>
                <Match when={typeof props.value === 'string' ? props.value : false}>
                  {(stringValue) => stringValue()}
                </Match>
              </Switch>
            </code>
          </div>
        </Match>
      </Switch>
    </div>
  );
}

export function DisplayData(props: DisplayDataProps) {
  return (
    <div class={styles.root}>
      <div class={styles.title}>
        {props.title}
      </div>
      <For each={props.lines}>
        {([title, value]) => (
          <DataLine
            title={title}
            value={value}
          />
        )}
      </For>
    </div>
  );
}