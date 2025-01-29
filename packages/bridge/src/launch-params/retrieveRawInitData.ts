import { isLaunchParamsQuery } from '@telegram-apps/transformers';

import { forEachLpSource } from '@/launch-params/forEachLpSource.js';
import { InitDataRetrieveError } from '@/errors.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

/**
 * @returns Raw init data from any known source.
 * @throws {InitDataRetrieveError} Unable to retrieve init data from any known source.
 */
export function retrieveRawInitData(): string | undefined {
  // Init data depends on the launch parameters. We also want them to be saved.
  try {
    retrieveLaunchParams();
  } catch {
    throw new InitDataRetrieveError();
  }

  let initData: string | undefined;
  forEachLpSource(v => {
    if (isLaunchParamsQuery(v)) {
      initData = new URLSearchParams(v).get('tgWebAppData') || undefined;
      return false;
    }
    return true;
  });
  return initData;
}