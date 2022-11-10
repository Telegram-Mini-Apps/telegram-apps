import {Bridge} from 'twa-bridge';

export interface WithCommonProps {
  /**
   * Bridge to use in component.
   * @default Bridge.init()
   */
  bridge?: Bridge;
}