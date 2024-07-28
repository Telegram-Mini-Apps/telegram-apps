import { createSignal } from '@/signals/utils.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import type { InitDataParsed } from '@/init-data/types.js';

export interface InitData extends InitDataParsed {
  /**
   * Date after which it is allowed to call
   * the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.
   */
  canSendAfterDate?: Date;
}

export const state = createSignal<InitData | undefined>(undefined);

/**
 * Initializes the init data.
 */
export function init(): void {
  const lp = retrieveLaunchParams();
  if (lp.initData) {
    const { initData: lpInitData } = lp;
    const { canSendAfter } = lpInitData;
    state.set({
      ...lpInitData,
      canSendAfterDate: canSendAfter
        ? new Date(lpInitData.authDate.getTime() + canSendAfter * 1000)
        : undefined
    });
  }
}
