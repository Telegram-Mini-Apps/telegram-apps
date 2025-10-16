import * as TE from 'fp-ts/TaskEither';
import type { RequestError } from '@tma.js/bridge';
import { type Computed, signal, computed } from '@tma.js/signals';
import type { BetterPromise } from 'better-promises';
import { pipe } from 'fp-ts/function';

import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { createWithChecksFp, type WithChecksFp, type WithChecks } from '@/wrappers/withChecksFp.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';
import type { ShowOptions } from '@/features/Popup/types.js';
import { ConcurrentCallError, type InvalidArgumentsError } from '@/errors.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { WithVersion } from '@/fn-options/withVersion.js';
import type { WithRequest } from '@/fn-options/withRequest.js';
import { prepareParams } from '@/features/Popup/prepareParams.js';

export interface PopupOptions extends SharedFeatureOptions, WithVersion, WithRequest {
}

/**
 * @since Mini Apps v6.2
 */
export class Popup {
  constructor({ version, isTma, request }: PopupOptions) {
    const isOpened = signal(false);
    const toggleClosed = () => {
      isOpened.set(false);
    };

    const wrapSupportedTask = createWithChecksFp({
      version,
      isTma,
      requires: 'web_app_open_popup',
      returns: 'task',
    });

    this.isSupported = createIsSupportedSignal('web_app_open_popup', version);
    this.isOpened = computed(isOpened);
    this.showFp = wrapSupportedTask(options => {
      return pipe(
        this.isOpened()
          ? TE.left(new ConcurrentCallError('A popup is already opened'))
          : TE.right(undefined as never),
        TE.chainW(() => TE.fromEither(prepareParams(options))),
        TE.chain(preparedOptions => {
          isOpened.set(true);
          return request('web_app_open_popup', 'popup_closed', {
            ...options,
            params: preparedOptions,
          });
        }),
        TE.mapBoth(
          err => {
            toggleClosed();
            return err;
          },
          response => {
            toggleClosed();
            return response.button_id;
          },
        ),
      );
    });
    this.show = throwifyWithChecksFp(this.showFp);
  }

  /**
   * Signal indicating if any popup is currently opened.
   */
  readonly isOpened: Computed<boolean>;

  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  /**
   * A method that shows a native popup described by the `params` argument.
   * The promise will be resolved when the popup is closed. Resolved value will have
   * an identifier of the pressed button.
   *
   * If a user clicked outside the popup or clicked the top right popup close
   * button, null will be resolved.
   *
   * @param options - popup parameters.
   * @since Mini Apps v6.2
   * @example
   * pipe(
   *   popup.showFp({
   *     title: 'Confirm action',
   *     message: 'Do you really want to buy this burger?',
   *     buttons: [
   *       { id: 'yes', text: 'Yes' },
   *       { id: 'no', type: 'destructive', text: 'No' },
   *     ],
   *   }),
   *   TE.map(buttonId => {
   *     console.log('User clicked a button with ID', buttonId);
   *   }),
   * );
   */
  readonly showFp: WithChecksFp<
    (options: ShowOptions) => TE.TaskEither<
      RequestError | InvalidArgumentsError | ConcurrentCallError,
      string | undefined
    >,
    true
  >;

  /**
   * @see showFp
   */
  readonly show: WithChecks<(options: ShowOptions) => BetterPromise<string | undefined>, true>;
}
