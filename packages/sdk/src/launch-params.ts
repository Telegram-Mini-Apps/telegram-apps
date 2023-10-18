import { parse, retrieveFromStorage, type LaunchParams } from '@tma.js/launch-params';

/**
 * Attempts to extract launch params from window.location.hash. In case, window.location.hash
 * lacks of valid data, function attempts to extract launch params from the sessionStorage.
 */
export function retrieveLaunchParams(): LaunchParams {
  let error: unknown | undefined;

  // Try to extract Mini App data from hash. This block of code  covers usual flow, when
  // application was firstly opened by the user and its hash always contains required parameters.
  try {
    return parse(window.location.hash.slice(1));
  } catch (e) {
    error = e;
  }

  // Mini Apps allows reloading current page. In this case, window.location.reload() will be
  // called which means, that init will be called again. As the result, current window
  // location will lose Mini App data. To solve this problem, we are extracting launch
  // params saved previously.
  const fromStorage = retrieveFromStorage();
  if (fromStorage) {
    return fromStorage;
  }

  throw new Error('Unable to extract launch params', { cause: error });
}
