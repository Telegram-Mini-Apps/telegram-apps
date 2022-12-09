import React from 'react';
import {CustomSwitchProps} from './shared';
import {AndroidSwitch} from './android';
import {IOSSwitch} from './ios';
import {DesktopSwitch} from './desktop';
import {WebSwitch} from './web';

export interface SwitchProps extends CustomSwitchProps {
  platform?: 'web' | 'desktop' | 'ios' | 'android';
  inactiveColor?: string;
  activeColor: string;
}

/**
 * Component which is able to render required Switch depending on passed
 * platform.
 * @param platform
 * @param rest
 * @constructor
 */
export function Switch({platform = 'web', ...rest}: SwitchProps) {
  if (platform === 'android') {
    return <AndroidSwitch {...rest}/>;
  }
  if (platform === 'ios') {
    return <IOSSwitch {...rest}/>;
  }
  if (platform === 'desktop') {
    return <DesktopSwitch {...rest}/>;
  }
  if (platform === 'web') {
    return <WebSwitch {...rest}/>;
  }
  throw new Error('not implemented');
}
