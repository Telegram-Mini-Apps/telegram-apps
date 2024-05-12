import { isRGB, type RGB as RGBType } from '@tma.js/sdk-react';
import type { FC, ReactNode } from 'react';

import { RGB } from '@/components/RGB/RGB';

import styles from './DisplayData.module.css';

export interface DisplayDataRow {
  title: string;
  value?: RGBType | string | boolean | ReactNode;
}

export interface DisplayDataProps {
  rows: DisplayDataRow[];
}

export const DisplayData: FC<DisplayDataProps> = ({ rows }) => (
  <div>
    {rows.map(({ title, value }, idx) => {
      let valueNode: ReactNode;

      if (value === undefined) {
        valueNode = <i>empty</i>;
      } else if (typeof value === 'string' && isRGB(value)) {
        valueNode = <RGB color={value} />;
      } else if (typeof value === 'boolean') {
        valueNode = value ? '✔️' : '❌';
      } else {
        valueNode = value;
      }

      return (
        <div className={styles.line} key={idx}>
          <span className={styles.lineTitle}>{title}</span>
          <span className={styles.lineValue}>{valueNode}</span>
        </div>
      );
    })}
  </div>
);
