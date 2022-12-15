import {SwitchBaseProps} from './base';

/**
 * List of properties used in custom switches.
 */
export interface CustomSwitchProps extends Omit<SwitchBaseProps, 'classes'> {
  classes?: Partial<SwitchClasses>;
}

/**
 * List of known platforms.
 */
export type SwitchPlatform = 'web' | 'desktop' | 'ios' | 'android';

/**
 * List of known switch sizes.
 */
export type SwitchSize = 'sm' | 'm' | 'l' | 'xl';

/**
 * List of class names used in SwitchBase component.
 */
export type SizedClassNames =
  | 'root' | `track${'' | 'Checked'}` | `switch${'' | 'Checked'}`
  | `rootSize${Uppercase<SwitchSize>}`
  | `trackSize${Uppercase<SwitchSize>}${'' | 'Checked'}`
  | `switchSize${Uppercase<SwitchSize>}${'' | 'Checked'}`;

export type SwitchClasses = {
  root: string;
  track: string;
  switch: string;
} & Record<SizedClassNames, string>;