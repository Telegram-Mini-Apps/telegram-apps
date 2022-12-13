import {SwitchBaseProps} from './base';

/**
 * List of properties used in custom switches.
 */
export interface CustomSwitchProps extends Omit<SwitchBaseProps, 'classes'> {
  classes?: Partial<SwitchClasses>;
}

/**
 * List of class names used in SwitchBase component.
 */
export type SwitchClasses = {
  root: string;
  rootSize: `rootSize${SwitchSize}`;
  track: string;
  trackSize: `trackSize${SwitchSize}`;
  trackSizeChecked: `trackSize${SwitchSize}Checked`;
  trackChecked: string;
  switch: string;
  switchActive: string;
  switchActiveChecked: string;
  switchSize: `switchSize${SwitchSize}`;
  switchSizeChecked: `switchSize${SwitchSize}Checked`;
};

/**
 * List of known switch sizes.
 */
export type SwitchSize = 'SM' | 'M' | 'L' | 'XL'