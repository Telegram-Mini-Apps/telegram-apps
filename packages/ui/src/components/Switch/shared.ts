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
  rootSizeL: string;
  track: string;
  trackSizeL: string;
  trackSizeLChecked: string;
  trackChecked: string;
  switch: string;
  switchActive: string;
  switchActiveChecked: string;
  switchSizeL: string;
  switchSizeLChecked: string;
};

/**
 * List of known switch sizes.
 */
export type SwitchSize = 'l';