import { vi } from 'vitest';
import { mockSessionStorageSetItem } from 'test-utils';
import { type PostEventFn, resetGlobals as resetBridgeState } from '@tma.js/bridge';
import { type LaunchParamsLike, serializeLaunchParamsQuery } from '@tma.js/transformers';

import type { ComponentStorage } from '@/component-storage.js';
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

export function createNoopComponentStorage<T>(): ComponentStorage<T> {
  const noop = () => undefined;
  return {
    get: noop,
    set: noop,
  };
}