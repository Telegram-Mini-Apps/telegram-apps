import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import type { EmojiStatusAccessRequestedStatus, RequestError } from '@tma.js/bridge';

import type { AsyncOptions } from '@/types.js';
import { withVersion, type WithVersion } from '@/fn-options/withVersion.js';
import { withRequest, type WithRequest } from '@/fn-options/withRequest.js';
import { withChecksFp } from '@/wrappers/withChecksFp.js';
import {
  sharedFeatureOptions,
  type SharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';

interface CreateOptions extends SharedFeatureOptions, WithVersion, WithRequest {
}

function create({ request, ...rest }: CreateOptions) {
  return withChecksFp((
    options: AsyncOptions,
  ): TE.TaskEither<RequestError, EmojiStatusAccessRequestedStatus> => {
    return pipe(
      request('web_app_request_emoji_status_access', 'emoji_status_access_requested', options),
      TE.map(response => response.status),
    );
  }, { ...rest, requires: 'web_app_request_emoji_status_access', returns: 'task' });
}

/**
 * Shows a native popup requesting permission for the bot to manage user's emoji status.
 * @param options - additional options.
 * @returns Emoji status access status.
 * @since Mini Apps v8.0
 * @example
 * const status = await requestEmojiStatusAccess();
 */
export const requestEmojiStatusAccessFp = create(pipe(
  sharedFeatureOptions(),
  withVersion,
  withRequest,
));

/**
 * @see requestEmojiStatusAccessFp
 */
export const requestEmojiStatusAccess = throwifyWithChecksFp(requestEmojiStatusAccessFp);
