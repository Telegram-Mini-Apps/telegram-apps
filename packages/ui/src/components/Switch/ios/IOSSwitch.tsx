import React from 'react';
import {SwitchBase} from '../base';
import c from './styles.scss';
import {mergeClasses} from '../../../styles';
import {CustomSwitchProps, SwitchClasses} from '../shared';

export type AndroidSwitchProps = CustomSwitchProps;

/**
 * Switch used on iOS platform.
 * @param props
 * @constructor
 */
export function IOSSwitch(props: AndroidSwitchProps) {
  const {classes = {}, ...rest} = props;
  const finalClasses = mergeClasses(c, classes) as SwitchClasses;

  return <SwitchBase classes={finalClasses} {...rest}/>
}