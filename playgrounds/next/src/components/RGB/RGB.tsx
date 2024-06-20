import { classNames, type RGB as RGBType } from '@tma.js/sdk-react';
import type { FC, JSX } from 'react';

import styles from './RGB.module.css';

export type RGBProps = JSX.IntrinsicElements['div'] & {
  color: RGBType;
};

export const RGB: FC<RGBProps> = ({ color, className, ...rest }) => (
  <span {...rest} className={classNames(styles.root, className)}>
    <i className={styles.icon} style={{ backgroundColor: color }} />
    {color}
  </span>
);
