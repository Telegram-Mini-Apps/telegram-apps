import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { signal } from '@/signals/signal/signal.js';
import { computed, type Computed } from '@/signals/computed/computed.js';

import type { InitData } from './types.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/init-data
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/init-data
 */


function createStateComputed<K extends keyof InitData>(
  key: K,
): Computed<InitData[K] | undefined> {
  return computed(() => {
    const s = state();
    return s ? s[key] : undefined;
  });
}

export const state = signal<InitData | undefined>(undefined);

/**
 * @see InitData.authDate
 */
export const authDate = createStateComputed('authDate');

/**
 * @see InitData.canSendAfter
 */
export const canSendAfter = createStateComputed('canSendAfter');

/**
 * Date after which it is allowed to call
 * the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.
 */
export const canSendAfterDate = computed(() => {
  const s = state();

  return s
    ? s.canSendAfter
      ? new Date(s.authDate.getTime() + s.canSendAfter * 1000)
      : undefined
    : undefined;
});

/**
 * @see InitData.chat
 */
export const chat = createStateComputed('chat');

/**
 * @see InitData.chatType
 */
export const chatType = createStateComputed('chatType');

/**
 * @see InitData.chatInstance
 */
export const chatInstance = createStateComputed('chatInstance');

/**
 * @see InitData.hash
 */
export const hash = createStateComputed('hash');

/**
 * @see InitData.queryId
 */
export const queryId = createStateComputed('queryId');

/**
 * Restores the component.
 */
export function restore(): void {
  state.set(retrieveLaunchParams().initData);
}

/**
 * @see InitData.receiver
 */
export const receiver = createStateComputed('receiver');

/**
 * @see InitData.startParam
 */
export const startParam = createStateComputed('startParam');

/**
 * @see InitData.user
 */
export const user = createStateComputed('user');
