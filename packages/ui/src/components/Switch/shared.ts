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
  rootSizeSM: string;
  rootSizeM: string;
  rootSizeL: string;
  rootSizeXL: string;
  track: string;
  trackSizeSM: string;
  trackSizeM: string;
  trackSizeL: string;
  trackSizeXL: string;
  trackSizeSMChecked: string;
  trackSizeMChecked: string;
  trackSizeLChecked: string;
  trackSizeXLChecked: string;
  trackChecked: string;
  switch: string;
  switchActive: string;
  switchActiveChecked: string;
  switchSizeSM: string;
  switchSizeM: string;
  switchSizeL: string;
  switchSizeXL: string;
  switchSizeSMChecked: string;
  switchSizeMChecked: string;
  switchSizeLChecked: string;
  switchSizeXLChecked: string;
};

/**
 * List of known switch sizes.
 */
// export type SwitchSize = {
//   sm: string,
//   m: string,
//   l: string,
//   xl: string,
// };

export type SwitchSize = ('sm' | 'm' | 'l' | 'xl')