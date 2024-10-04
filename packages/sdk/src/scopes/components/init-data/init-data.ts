import { computed, type Computed, signal } from '@telegram-apps/signals';
import { type InitData, retrieveLaunchParams } from '@telegram-apps/bridge';

/* USUAL */

/**
 * Complete component state.
 */
export const state = signal<InitData | undefined>(undefined);

/* COMPUTED */

function fromState<K extends keyof InitData>(key: K): Computed<InitData[K] | undefined> {
  return computed(() => {
    const s = state();
    return s ? s[key] : undefined;
  });
}

/**
 * @see InitData.authDate
 */
export const authDate = fromState('authDate');

/**
 * @see InitData.canSendAfter
 */
export const canSendAfter = fromState('canSendAfter');

/**
 * Date after which it is allowed to call
 * the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.
 */
export const canSendAfterDate = computed(() => {
  const authDateValue = authDate();
  const canSendAfterValue = canSendAfter();

  return canSendAfterValue && authDateValue
    ? new Date(authDateValue.getTime() + canSendAfterValue * 1000)
    : undefined
});

/**
 * @see InitData.chat
 */
export const chat = fromState('chat');

/**
 * @see InitData.chatType
 */
export const chatType = fromState('chatType');

/**
 * @see InitData.chatInstance
 */
export const chatInstance = fromState('chatInstance');

/**
 * @see InitData.hash
 */
export const hash = fromState('hash');

/**
 * @see InitData.queryId
 */
export const queryId = fromState('queryId');

/**
 * Raw representation of init data.
 */
export const raw = signal<string | undefined>();

/**
 * @see InitData.receiver
 */
export const receiver = fromState('receiver');

/**
 * Restores the component state.
 */
export function restore(): void {
  const lp = retrieveLaunchParams();
  state.set(lp.initData);
  raw.set(lp.initDataRaw);
}

/**
 * @see InitData.startParam
 */
export const startParam = fromState('startParam');

/**
 * @see InitData.user
 */
export const user = fromState('user');