import React, { FunctionComponent } from 'react'
import { mergeClasses } from '../mergeClasses';
import { CustomSwitchProps, SwitchClasses } from '../../components/Switch/shared'
import { SwitchBaseProps } from '../../components/Switch/base/SwitchBase'

export default function withStyles(styles: any, Component: FunctionComponent<SwitchBaseProps>): any {
  return function(props: CustomSwitchProps) {
    const {classes = {}, ...rest} = props;
    const mergedClasses = mergeClasses(styles, classes) as SwitchClasses;
    return <Component classes={mergedClasses} {...rest}/>
  }
}