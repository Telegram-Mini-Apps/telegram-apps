import React from 'react';
import {SwitchBase} from '../base';
import {mergeClasses} from '../../../styles';
import {CustomSwitchProps, SwitchClasses} from '../shared';

import styles from './styles.scss';

export type WebSwitchProps = CustomSwitchProps;

console.log(styles)

/**
 * Switch used on Android platform.
 * @param props
 * @constructor
 */
export function WebSwitch(props: WebSwitchProps) {
  const {classes = {}, ...rest} = props;
  const finalClasses = mergeClasses(styles, classes) as SwitchClasses;

  return <SwitchBase classes={finalClasses} {...rest}/>
}