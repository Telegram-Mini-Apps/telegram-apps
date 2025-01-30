import { retrieveRawLaunchParams } from '@/launch-params/retrieveRawLaunchParams.js';

/**
 * @returns Raw init data from any known source.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch params from any known source.
 */
export function retrieveRawInitData(): string | undefined {
  return new URLSearchParams(retrieveRawLaunchParams()).get('tgWebAppData') || undefined;
}