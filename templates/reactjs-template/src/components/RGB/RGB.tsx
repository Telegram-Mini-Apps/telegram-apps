import { classNames, type RGB as RGBType } from '@tma.js/sdk-react';
import type { FC } from 'react';

import './RGB.css';

export type RGBProps = JSX.IntrinsicElements['div'] & {
  color: RGBType;
};

export const RGB: FC<RGBProps> = ({ color, className, ...rest }) => (
  <span {...rest} className={classNames('rgb', className)}>
    <i className='rgb__icon' style={{ backgroundColor: color }}/>
    {color}
  </span>
);
