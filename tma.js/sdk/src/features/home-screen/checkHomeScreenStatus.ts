import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import type { HomeScreenStatus, RequestError } from '@tma.js/bridge';

import {
  sharedFeatureOptions,
  type SharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { withVersion, type WithVersion } from '@/fn-options/withVersion.js';
import { withChecksFp } from '@/wrappers/withChecksFp.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';
import { withRequest, type WithRequest } from '@/fn-options/withRequest.js';
import type { AsyncOptions } from '@/types.js';

interface CreateOptions extends SharedFeatureOptions, WithRequest, WithVersion {
}

function create({ request, ...rest }: CreateOptions) {
  return withChecksFp((options?: AsyncOptions): TE.TaskEither<RequestError, HomeScreenStatus> => {
    return pipe(
      request('web_app_check_home_screen', 'home_screen_checked', options),
      TE.map(response => response.status || 'unknown'),
    );
  }, { ...rest, requires: 'web_app_check_home_screen', returns: 'task' });
}

/**
 * Sends a request to the native Telegram application to check if the current mini
 * application is added to the device's home screen.
 * @param options - additional options.
 * @since Mini Apps v8.0
 */
export const checkHomeScreenStatusFp = create(pipe(
  sharedFeatureOptions(),
  withVersion,
  withRequest,
));

/**
 * @see checkHomeScreenStatusFp
 */
export const checkHomeScreenStatus = throwifyWithChecksFp(checkHomeScreenStatusFp);
