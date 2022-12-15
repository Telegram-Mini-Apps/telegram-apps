import React, {useCallback, useState} from 'react';
import cn from 'classnames';
import {SwitchClasses, SwitchSize} from '../shared';
import styles from './styles.scss';

export interface SwitchBaseProps {
  size?: SwitchSize;
  classes?: SwitchClasses;
  activeColor?: string;
  inactiveColor?: string;
}

/**
 * Represents a base for any other created switches.
 * @param props
 * @constructor
 */
export function SwitchBase(props: SwitchBaseProps) {
  const {size, activeColor, inactiveColor} = props;
  const [checked, setChecked] = useState(false);
  const [active, setActive] = useState(false);

  const onChange = useCallback(() => setChecked(state => !state), []);
  const disable = useCallback(() => setActive(false), []);
  const enable = useCallback(() => setActive(true), []);

  const classes = props.classes as (SwitchClasses & Record<string, string>);
  const s = size ? size.toUpperCase() : "L";

  const rootCn = cn(classes.root, classes[`rootSize${s}`]);
  const trackCn = cn(classes.track, {
    [classes.trackChecked]: checked,
    [classes[`trackSize${s}`]]: true,
    [classes[`trackSize${s}Checked`]]: true && checked,
  });
  const switchCn = cn(classes.switch, {
    [classes.switchChecked]: checked,
    [classes.switchActive]: active,
    [classes.switchActiveChecked]: active && checked,
    [classes[`switchSize${s}`]]: true,
    [classes[`switchSize${s}Checked`]]: true && checked,
  });

  return (
    <label
      className={rootCn}
      onMouseDown={enable}
      onMouseLeave={disable}
      onMouseUp={disable}
    >
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span
        className={trackCn}
        style={{backgroundColor: checked ? activeColor : inactiveColor}}
      />
      <span
        className={switchCn}
        style={{borderColor: checked ? activeColor : inactiveColor}}
      />
    </label>
  );
}