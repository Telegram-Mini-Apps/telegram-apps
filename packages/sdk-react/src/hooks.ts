import { useMemo, useSyncExternalStore } from 'react';
import {
  retrieveLaunchParams,
  retrieveRawLaunchParams,
  retrieveRawInitData,
  retrieveAndroidDeviceData,
  retrieveAndroidDeviceDataFrom,
  type AndroidDeviceData,
  type RetrieveLPResult,
  type RetrieveLPResultCamelCased,
} from '@telegram-apps/sdk';

/**
 * Returns the underlying signal value updating it each time the signal value changes.
 * @param signal - a signal.
 * @param getServerSnapshot - an optional function returning the signal value snapshot. It is used
 *   only during SSR to provide an initial value of the signal. When not set, defaults to the
 *   signal itself.
 */
export function useSignal<T>(
  signal: {
    (): T;
    sub(fn: VoidFunction): VoidFunction;
  },
  getServerSnapshot?: () => T,
): T {
  return useSyncExternalStore(
    (onStoreChange) => signal.sub(onStoreChange),
    signal,
    getServerSnapshot || signal,
  );
}

/**
 * @returns Launch parameters from any known source.
 * @param camelCase - should the output be camel-cased.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function useLaunchParams(camelCase?: false): RetrieveLPResult;
/**
 * @returns Launch parameters from any known source.
 * @param camelCase - should the output be camel-cased.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function useLaunchParams(camelCase: true): RetrieveLPResultCamelCased;
export function useLaunchParams(camelCase?: boolean): RetrieveLPResult | RetrieveLPResultCamelCased {
  return useMemo(() => retrieveLaunchParams(camelCase as any), [camelCase]);
}

/**
 * @returns Launch parameters in a raw format from any known source.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 * @see retrieveRawLaunchParams
 */
export function useRawLaunchParams(): string {
  return useMemo(retrieveRawLaunchParams, []);
}

/**
 * @returns Raw init data from any known source.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch params from any known source.
 */
export function useRawInitData(): string | undefined {
  return useMemo(retrieveRawInitData, []);
}

/**
 * Retrieves Android device data from the navigator.userAgent.
 * @see https://core.telegram.org/bots/webapps#additional-data-in-user-agent
 */
export function useAndroidDeviceData(): AndroidDeviceData {
  return useMemo(retrieveAndroidDeviceData, []);
}

/**
 * Retrieves Android device data from the specified User Agent.
 * @see https://core.telegram.org/bots/webapps#additional-data-in-user-agent
 * @param userAgent - user agent.
 */
export function useAndroidDeviceDataFrom(userAgent: string): AndroidDeviceData {
  return useMemo(() => retrieveAndroidDeviceDataFrom(userAgent), [userAgent]);
}