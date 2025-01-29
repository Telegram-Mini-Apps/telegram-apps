import type { Computed } from '@telegram-apps/signals';
import { retrieveLaunchParams, retrieveRawInitData } from '@telegram-apps/bridge';
import type { InitData } from '@telegram-apps/types';

import { createComputed, createSignalsTuple } from '@/signals-registry.js';

/**
 * Complete component state.
 */
export const [_state, state] =
  createSignalsTuple<InitData | undefined>(undefined);

function fromState<K extends keyof InitData>(key: K): Computed<InitData[K] | undefined> {
  return createComputed(() => {
    const s = state();
    return s ? s[key] : undefined;
  });
}

/**
 * @see InitData.auth_date
 */
export const authDate = fromState('auth_date');

/**
 * @see InitData.can_send_after
 */
export const canSendAfter = fromState('can_send_after');

/**
 * Date after which it is allowed to call
 * the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.
 */
export const canSendAfterDate = createComputed(() => {
  const authDateValue = authDate();
  const canSendAfterValue = canSendAfter();

  return canSendAfterValue && authDateValue
    ? new Date(authDateValue.getTime() + canSendAfterValue * 1000)
    : undefined;
});

/**
 * @see InitData.chat
 */
export const chat = fromState('chat');

/**
 * @see InitData.chat_type
 */
export const chatType = fromState('chat_type');

/**
 * @see InitData.chat_instance
 */
export const chatInstance = fromState('chat_instance');

/**
 * @see InitData.hash
 */
export const hash = fromState('hash');

/**
 * @see InitData.query_id
 */
export const queryId = fromState('query_id');

/**
 * Raw representation of init data.
 */
export const [_raw, raw] = createSignalsTuple<string | undefined>();

/**
 * @see InitData.receiver
 */
export const receiver = fromState('receiver');

/**
 * Restores the component state.
 */
export function restore(): void {
  const lp = retrieveLaunchParams();
  _state.set(lp.tgWebAppData);
  _raw.set(retrieveRawInitData());
}

/**
 * @see InitData.start_param
 */
export const startParam = fromState('start_param');

/**
 * @see InitData.user
 */
export const user = fromState('user');