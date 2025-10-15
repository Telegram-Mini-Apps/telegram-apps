import { computed, type Computed, signal } from '@tma.js/signals';
import type { InitData as InitDataType } from '@tma.js/types';
import { eitherGet } from '@tma.js/toolkit';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

export interface InitDataOptions<EComplete, ERaw> {
  /**
   * Retrieves init data from the current environment.
   */
  retrieveInitData: () => E.Either<EComplete, O.Option<InitDataType>>;
  /**
   * Retrieves raw init data from the current environment.
   */
  retrieveRawInitData: () => E.Either<ERaw, O.Option<string>>;
}

export class InitData<EComplete extends Error, ERaw extends Error> {
  constructor(options: InitDataOptions<EComplete, ERaw>) {
    this.restore = () => {
      pipe(eitherGet(options.retrieveInitData()), O.map(this._state.set));
      pipe(eitherGet(options.retrieveRawInitData()), O.map(this._raw.set));
    };
  }

  private fromState<K extends keyof InitDataType>(key: K): Computed<InitDataType[K] | undefined> {
    return computed(() => {
      const s = this._state();
      return s ? s[key] : undefined;
    });
  }

  private readonly _state = signal<InitDataType>();

  private readonly _raw = signal<string>();

  /**
   * Complete component state.
   */
  readonly state = computed(this._state);

  /**
   * @see InitDataType.auth_date
   */
  readonly authDate = this.fromState('auth_date');

  /**
   * @see InitDataType.can_send_after
   */
  readonly canSendAfter = this.fromState('can_send_after');

  /**
   * Date after which it is allowed to call
   * the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.
   */
  readonly canSendAfterDate = computed(() => {
    const authDateValue = this.authDate();
    const canSendAfterValue = this.canSendAfter();

    return canSendAfterValue && authDateValue
      ? new Date(authDateValue.getTime() + (canSendAfterValue * 1000))
      : undefined;
  });

  /**
   * @see InitDataType.chat
   */
  readonly chat = this.fromState('chat');

  /**
   * @see InitDataType.chat_type
   */
  readonly chatType = this.fromState('chat_type');

  /**
   * @see InitDataType.chat_instance
   */
  readonly chatInstance = this.fromState('chat_instance');

  /**
   * @see InitDataType.hash
   */
  readonly hash = this.fromState('hash');

  /**
   * @see InitDataType.query_id
   */
  readonly queryId = this.fromState('query_id');

  /**
   * Raw representation of init data.
   */
  readonly raw = computed(this._raw);

  /**
   * @see InitDataType.receiver
   */
  readonly receiver = this.fromState('receiver');

  /**
   * @see InitDataType.signature
   */
  readonly signature = this.fromState('signature');

  /**
   * @see InitDataType.start_param
   */
  readonly startParam = this.fromState('start_param');

  /**
   * @see InitDataType.user
   */
  readonly user = this.fromState('user');

  /**
   * Restores the component state.
   */
  restore: () => void;
}
