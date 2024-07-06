import { classNames, type RGB as RGBType } from '@telegram-apps/sdk-solid';
import { type Component, type JSX, splitProps } from 'solid-js';

import './RGB.css';

export type RGBProps = JSX.IntrinsicElements['span'] & {
  color: RGBType;
};

export const RGB: Component<RGBProps> = (props) => (
  <span {...splitProps(props, ['class'])[0]} class={classNames('rgb', props.class)}>
    <i class="rgb__icon" style={{ 'background-color': props.color }}/>
    {props.color}
  </span>
);
