import type { PostEventError } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

import {
  sharedFeatureOptions,
  type SharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { withPostEvent, type WithPostEvent } from '@/fn-options/withPostEvent.js';
import { withChecksFp } from '@/wrappers/withChecksFp.js';
import { InvalidArgumentsError } from '@/errors.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';

interface CreateOptions extends SharedFeatureOptions, WithPostEvent {
}

export type SendDataError = PostEventError | InvalidArgumentsError;

function create({ postEvent, ...rest }: CreateOptions) {
  return withChecksFp((data: string): E.Either<SendDataError, void> => {
    const { size } = new Blob([data]);
    if (!size || size > 4096) {
      return E.left(
        new InvalidArgumentsError(size
          ? 'Maximum size of data to send is 4096 bytes'
          : 'Attempted to send empty data'),
      );
    }
    return postEvent('web_app_data_send', { data });
  }, { ...rest, returns: 'either' });
}

/**
 * Sends data to the bot.
 *
 * When this method called, a service message sent to the bot containing the data of the length
 * up to 4096 bytes, and the Mini App closed.
 *
 * See the field `web_app_data` in the class [Message](https://core.telegram.org/bots/api#message).
 *
 * This method is only available for Mini Apps launched via a Keyboard button.
 * @param data - data to send to bot.
 */
export const sendDataFp = create(pipe(sharedFeatureOptions(), withPostEvent));

/**
 * @see sendDataFp
 */
export const sendData = throwifyWithChecksFp(sendDataFp);
