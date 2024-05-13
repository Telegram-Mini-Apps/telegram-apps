import { classNames } from '@tma.js/sdk-solid';
import { splitProps } from 'solid-js';

import './RGB.css';

/**
 * @typedef RGBProps
 * @extends {import('solid-js').JSX.IntrinsicElements['span']}
 * @property {import('@tma.js/sdk-solid').RGB} color
 */

/**
 * @param {RGBProps} props
 * @return {import('solid-js').JSXElement}
 */
export function RGB(props) {
  return (
    <span {...splitProps(props, ['class'])[0]} class={classNames('rgb', props.class)}>
      <i class="rgb__icon" style={{ 'background-color': props.color }}/>
        {props.color}
    </span>
  );
}
