import { vi } from 'vitest';
import { mockSessionStorageSetItem } from 'test-utils';
import { type PostEventFn, resetPackageState as resetBridgeState } from '@telegram-apps/bridge';
import { type LaunchParamsLike, serializeLaunchParamsQuery } from '@telegram-apps/transformers';

import { $postEvent, _$launchParams, $launchParams, type PackageLaunchParams } from '@/globals.js';
import { resetSignals } from '@/signals-registry.js';

export function mockPostEvent(postEvent: PostEventFn = () => null) {
  const fn = vi.fn(postEvent);
  $postEvent.set(fn as any);
  return fn;
}

export function mockMiniAppsEnv(lp: LaunchParamsLike = {
  tgWebAppPlatform: 'tdesktop',
  tgWebAppVersion: '10',
  tgWebAppThemeParams: {},
}) {
  mockSessionStorageSetItem();
  vi
    .spyOn(window.location, 'href', 'get')
    .mockImplementation(() => `/?${serializeLaunchParamsQuery(lp)}`);
}

export function resetPackageState() {
  [resetBridgeState, resetSignals].forEach(reset => reset());
}

export function setLaunchParams(lp: PackageLaunchParams = {
  tgWebAppPlatform: 'tdesktop',
  tgWebAppVersion: '10',
}) {
  _$launchParams.set(lp);
}

/**
 *
 * @param version
 */
export function setVersion(version: string) {
  setLaunchParams({ ...$launchParams(), tgWebAppVersion: version });
}

/**
 * Makes the package think that the package is initialized.
 */
export function setMaxVersion() {
  setVersion('100');
}