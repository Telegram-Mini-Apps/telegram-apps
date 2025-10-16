import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { captureSameReq, type RequestError } from '@tma.js/bridge';

import {
  sharedFeatureOptions,
  type SharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { withVersion, type WithVersion } from '@/fn-options/withVersion.js';
import { withRequest, type WithRequest } from '@/fn-options/withRequest.js';
import { withChecksFp } from '@/wrappers/withChecksFp.js';
import type { AsyncOptions } from '@/types.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';
import { createRequestId } from '@/globals/createRequestId.js';

interface CreateOptions extends SharedFeatureOptions, WithVersion, WithRequest {
  createRequestId: () => string;
}

export type ReadTextFromClipboardError = RequestError;

function create({ request, createRequestId, ...rest }: CreateOptions) {
  return withChecksFp((
    options?: AsyncOptions,
  ): TE.TaskEither<ReadTextFromClipboardError, string | null> => {
    const reqId = createRequestId();
    return pipe(
      request('web_app_read_text_from_clipboard', 'clipboard_text_received', {
        ...options,
        params: { req_id: reqId },
        capture: captureSameReq(reqId),
      }),
      TE.map(({ data = null }) => data),
    );
  }, { ...rest, isSupported: 'web_app_read_text_from_clipboard', returns: 'task' });
}

/**
 * Reads a text from the clipboard and returns a `string` or `null`. `null` is returned
 * in one of the following cases:
 * - A value in the clipboard is not a text.
 * - Access to the clipboard is not granted.
 * @since Mini Apps v6.4
 */
export const readTextFromClipboardFp = create({
  ...pipe(
    sharedFeatureOptions(),
    withVersion,
    withRequest,
  ),
  createRequestId,
});

export const readTextFromClipboard = throwifyWithChecksFp(readTextFromClipboardFp);
