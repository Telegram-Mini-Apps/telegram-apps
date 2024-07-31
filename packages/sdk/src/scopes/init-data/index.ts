import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

import * as _ from './private.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/init-data
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/init-data
 */

/**
 * Restores the component state.
 */
function restore(): void {
  _.state.set(retrieveLaunchParams().initData);
}

export {
  restore,
};
export {
  authDate,
  canSendAfter,
  canSendAfterDate,
  chat,
  chatType,
  chatInstance,
  hash,
  startParam,
  state,
  queryId,
  receiver,
  user,
} from './computed.js';
