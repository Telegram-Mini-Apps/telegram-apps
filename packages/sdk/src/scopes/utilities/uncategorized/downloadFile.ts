import { request } from '@/globals.js';
import { wrapSafe } from '@/scopes/wrappers/wrapSafe.js';
import { AccessDeniedError } from '@/errors.js';
import type { RequestOptionsNoCapture } from '@/types.js';

const METHOD_NAME = 'web_app_request_file_download';

/**
 * Displays a native popup prompting the user to download a file.
 * @param url - the HTTPS URL of the file to be downloaded.
 * @param file - the suggested name for the downloaded file.
 * @param options - additional request execution options.
 * @since Mini Apps v8.0
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {AccessDeniedError} User denied the action
 * @example
 * if (downloadFile.isAvailable()) {
 *   await downloadFile('https://telegram.org/js/telegram-web-app.js', 'telegram-sdk.js');
 * }
 */
export const downloadFile = wrapSafe(
  'downloadFile',
  (url: string, fileName: string, options?: RequestOptionsNoCapture) => {
    return request(
      METHOD_NAME,
      'file_download_requested',
      { ...options, params: { url, file_name: fileName } },
    ).then(response => {
      if (response.status !== 'downloading') {
        throw new AccessDeniedError('User denied the action');
      }
    });
  }, { isSupported: METHOD_NAME },
);