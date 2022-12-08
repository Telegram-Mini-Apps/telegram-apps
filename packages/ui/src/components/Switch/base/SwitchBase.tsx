import React, {useCallback, useState} from 'react';
import cn from 'classnames';
import {SwitchClasses, SwitchSize} from '../shared';
import styles from './styles.scss';

export interface SwitchBaseProps {
  size?: SwitchSize;
  classes: SwitchClasses;
  activeColor: string;
  inactiveColor?: string;
}

/**
 * Represents a base for any other created switches.
 * @param props
 * @constructor
 */
export function SwitchBase(props: SwitchBaseProps) {
  const {size = 'l', classes, activeColor, inactiveColor} = props;
  const [checked, setChecked] = useState(false);
  const [active, setActive] = useState(false);

  const onChange = useCallback(() => setChecked(state => !state), []);
  const disable = useCallback(() => setActive(false), []);
  const enable = useCallback(() => setActive(true), []);

  const isLarge = size === 'l';

  const rootCn = cn(classes.root, {[classes.rootSizeL]: isLarge});
  const trackCn = cn(classes.track, {
    [classes.trackChecked]: checked,
    [classes.trackSizeL]: isLarge,
    [classes.trackSizeLChecked]: isLarge && checked,
  });
  const switchCn = cn(classes.switch, {
    [classes.switchActive]: active,
    [classes.switchActiveChecked]: active && checked,
    [classes.switchSizeL]: isLarge,
    [classes.switchSizeLChecked]: isLarge && checked,
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