import { vi } from 'vitest';
import { mockSessionStorageSetItem } from 'test-utils';

/**
 * Mocks the current environment making the code determining it as
 * the Mini Apps environment.
 */
export function mockMiniAppsEnv() {
  mockSessionStorageSetItem();
  vi
    .spyOn(window.location, 'href', 'get')
    .mockImplementation(() => '/?tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D');
}