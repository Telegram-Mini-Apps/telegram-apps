import { expect, it, describe } from 'vitest';

import type {
  MiniAppsMethodName,
  MiniAppsMethodVersionedParams,
  MiniAppsMethodWithVersionedParams,
} from '@/bridge/methods/types/methods.js';
import type { Version } from '@/version/types.js';

import { supports } from './supports.js';

type HaveCheckSupportMethodObj = {
  [M in MiniAppsMethodWithVersionedParams]: {
    title: string;
    method: M;
    parameter: MiniAppsMethodVersionedParams<M>
  }
}[MiniAppsMethodWithVersionedParams];

/**
 * Increases specified version by amount of updates.
 * @param version - initial version.
 * @param amount - count of bumps.
 */
function increaseVersion(version: Version, amount: number): string {
  const [, major, minor] = version.match(/(\d+)\.(\d+)$/)!.map(Number);
  return minor + amount >= 0
    ? `${major}.${minor + amount}`
    : `${major - 1}.99`;
}

describe.each<[
  version: Version,
  methods: (MiniAppsMethodName | HaveCheckSupportMethodObj)[],
]>([
  ['6.0', [
    'iframe_ready',
    'iframe_will_reload',
    'web_app_close',
    'web_app_data_send',
    'web_app_expand',
    'web_app_open_link',
    'web_app_ready',
    'web_app_request_theme',
    'web_app_request_viewport',
    'web_app_setup_main_button',
    'web_app_setup_closing_behavior',
  ]],
  ['6.1', [
    'web_app_open_tg_link',
    'web_app_open_invoice',
    'web_app_setup_back_button',
    'web_app_set_background_color',
    'web_app_set_header_color',
    'web_app_trigger_haptic_feedback',
  ]],
  ['6.2', [
    'web_app_open_popup',
  ]],
  ['6.4', [
    'web_app_read_text_from_clipboard',
    'web_app_close_scan_qr_popup',
    'web_app_close_scan_qr_popup',
    {
      title: 'web_app_open_link.try_instant_view',
      method: 'web_app_open_link',
      parameter: 'try_instant_view',
    },
  ]],
  ['6.7', [
    'web_app_switch_inline_query',
  ]],
  ['6.9', [
    'web_app_invoke_custom_method',
    'web_app_request_write_access',
    'web_app_request_phone',
    {
      title: 'web_app_set_header_color.color',
      method: 'web_app_set_header_color',
      parameter: 'color',
    },
  ]],
  ['6.10', [
    'web_app_setup_settings_button',
  ]],
  ['7.2', [
    'web_app_biometry_get_info',
    'web_app_biometry_open_settings',
    'web_app_biometry_request_access',
    'web_app_biometry_request_auth',
    'web_app_biometry_update_token',
  ]],
  ['7.6', [
    {
      title: 'web_app_open_link.try_browser',
      method: 'web_app_open_link',
      parameter: 'try_browser',
    },
    {
      title: 'web_app_close.return_back',
      method: 'web_app_close',
      parameter: 'return_back',
    },
  ]],
  ['7.7', [
    'web_app_setup_swipe_behavior',
  ]],
])('%s', (version, methods) => {
  const higher = increaseVersion(version, 1);
  const lower = increaseVersion(version, -1);

  const methodsOnly = methods.filter((m): m is MiniAppsMethodName => {
    return typeof m === 'string';
  });

  const paramsOnly = methods.filter((m): m is HaveCheckSupportMethodObj => {
    return typeof m === 'object';
  });

  describe.each(methodsOnly)('%s', (method) => {
    it(`should return true if version >= ${version} (${higher})`, () => {
      expect(supports(method, version)).toBe(true);
      expect(supports(method, higher)).toBe(true);
    });

    if (version !== '6.0') {
      it(`should return false if version < ${version} (${lower})`, () => {
        expect(supports(method, lower)).toBe(false);
      });
    }
  });

  describe.each(paramsOnly)('$title', ({ method, parameter }) => {
    it(`should return true if version >= ${version} (${higher})`, () => {
      expect(supports(method, parameter, version)).toBe(true);
      expect(supports(method, parameter, higher)).toBe(true);
    });

    it(`should return false if version < ${version} (${lower})`, () => {
      expect(supports(method, parameter, lower)).toBe(false);
    });
  });
});
