import React from 'react';
import {SwitchBase} from '../base';
import {mergeClasses} from '../../../styles';
import {CustomSwitchProps, SwitchClasses} from '../shared';

import styles from './styles.scss';

export type DesktopSwitchProps = CustomSwitchProps;

console.log(styles)

/**
 * Switch used on Android platform.
 * @param props
 * @constructor
 */
export function DesktopSwitch(props: DesktopSwitchProps) {
  const {classes = {}, ...rest} = props;
  const finalClasses = mergeClasses(styles, classes) as SwitchClasses;

  return <SwitchBase classes={finalClasses} {...rest}/>
}