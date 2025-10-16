import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { RequestError } from '@tma.js/bridge';

import type { RequestOptionsNoCapture } from '@/types.js';
import { SetEmojiStatusError } from '@/errors.js';
import { withChecksFp } from '@/wrappers/withChecksFp.js';
import {
  type SharedFeatureOptions,
  sharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { withRequest, type WithRequest } from '@/fn-options/withRequest.js';
import { withVersion, type WithVersion } from '@/fn-options/withVersion.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';

export interface SetEmojiStatusOptions extends RequestOptionsNoCapture {
  duration?: number;
}

interface CreateSetEmojiStatusImplOptions extends SharedFeatureOptions, WithRequest, WithVersion {
}

/**
 * @internal
 */
function createSetEmojiStatus({ request, ...rest }: CreateSetEmojiStatusImplOptions) {
  return withChecksFp((
    customEmojiId: string,
    options?: SetEmojiStatusOptions,
  ): TE.TaskEither<RequestError | SetEmojiStatusError, void> => {
    return pipe(
      request('web_app_set_emoji_status', ['emoji_status_set', 'emoji_status_failed'], {
        params: {
          custom_emoji_id: customEmojiId,
          duration: (options || {}).duration,
        },
        ...options,
      }),
      TE.chainW(response => {
        return response && 'error' in response
          ? TE.left(new SetEmojiStatusError(response.error))
          : TE.right(undefined);
      }),
    );
  }, {
    ...rest,
    isSupported: 'web_app_set_emoji_status',
    returns: 'task',
  });
}

/**
 * Opens a dialog allowing the user to set the specified custom emoji as their status.
 * @returns Nothing if status set was successful.
 * @param options - additional options.
 * @since Mini Apps v8.0
 * @example
 * pipe(
 *   setEmojiStatusFp('5361800828313167608'),
 *   TE.match(error => {
 *     console.error('Error occurred', error);
 *   }, () => {
 *     console.log('Status set');
 *   }),
 * );
 * const statusSet = await setEmojiStatus('5361800828313167608');
 */
export const setEmojiStatusFp = createSetEmojiStatus(pipe(
  sharedFeatureOptions(),
  withRequest,
  withVersion,
));

/**
 * @see setEmojiStatusFp
 */
export const setEmojiStatus = throwifyWithChecksFp(setEmojiStatusFp);
