import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import type { PhoneRequestedStatus, RequestError } from '@tma.js/bridge';

import {
  sharedFeatureOptions,
  type SharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { withVersion, type WithVersion } from '@/fn-options/withVersion.js';
import { withChecksFp } from '@/with-checks/withChecksFp.js';
import { throwifyWithChecksFp } from '@/with-checks/throwifyWithChecksFp.js';
import { withRequest, type WithRequest } from '@/fn-options/withRequest.js';
import type { AsyncOptions } from '@/types.js';

interface CreateOptions extends SharedFeatureOptions, WithRequest, WithVersion {
}

export type RequestPhoneAccessError = RequestError;

function create({ request, ...rest }: CreateOptions) {
  return withChecksFp((
    options?: AsyncOptions,
  ): TE.TaskEither<RequestPhoneAccessError, PhoneRequestedStatus> => {
    return pipe(
      request('web_app_request_phone', 'phone_requested', options),
      TE.map(response => response.status),
    );
  }, { ...rest, requires: 'web_app_request_phone', returns: 'task' });
}

/**
 * Requests current user phone access. Method returns promise, which resolves
 * status of the request. In case, user accepted the request, Mini App bot will receive
 * the according notification.
 *
 * To obtain the retrieved information instead, utilize the `requestContact` method.
 * @param options - additional options.
 * @since Mini Apps v6.9
 * @see requestContact
 */
export const requestPhoneAccessFp = create(pipe(
  sharedFeatureOptions(),
  withVersion,
  withRequest,
));

/**
 * @see requestPhoneAccessFp
 */
export const requestPhoneAccess = throwifyWithChecksFp(requestPhoneAccessFp);
