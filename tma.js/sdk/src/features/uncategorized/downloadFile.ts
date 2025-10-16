import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { RequestError } from '@tma.js/bridge';

import { AccessDeniedError } from '@/errors.js';
import type { AsyncOptions } from '@/types.js';
import {
  sharedFeatureOptions,
  type SharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { withChecksFp } from '@/wrappers/withChecksFp.js';
import { withRequest, type WithRequest } from '@/fn-options/withRequest.js';
import { withVersion, type WithVersion } from '@/fn-options/withVersion.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';

interface CreateOptions extends SharedFeatureOptions, WithRequest, WithVersion {
}

export type DownloadFileError = RequestError | AccessDeniedError;

function create({ request, ...rest }: CreateOptions) {
  return withChecksFp((
    url: string,
    fileName: string,
    options?: AsyncOptions,
  ): TE.TaskEither<DownloadFileError, void> => {
    return pipe(
      request(
        'web_app_request_file_download',
        'file_download_requested',
        { ...options, params: { url, file_name: fileName } },
      ),
      TE.chain(response => {
        return response.status === 'downloading'
          ? TE.right(undefined)
          : TE.left(new AccessDeniedError('User denied the action'));
      }),
    );
  }, { ...rest, requires: 'web_app_request_file_download', returns: 'task' });
}

/**
 * Displays a native popup prompting the user to download a file.
 * @param url - the HTTPS URL of the file to be downloaded.
 * @param file - the suggested name for the downloaded file.
 * @param options - additional request execution options.
 * @since Mini Apps v8.0
 * @example
 * pipe(
 *   downloadFileFp('https://telegram.org/js/telegram-web-app.js', 'telegram-sdk.js'),
 *   TE.map(() => {
 *     console.log('Downloading');
 *   })
 * )
 */
export const downloadFileFp = create(pipe(
  sharedFeatureOptions(),
  withRequest,
  withVersion,
));

export const downloadFile = throwifyWithChecksFp(downloadFileFp);
