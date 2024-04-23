import { expect, it } from 'vitest';

import type {
  MiniAppsMethodName,
  MiniAppsMethodVersionedParams,
  MiniAppsMethodWithVersionedParams,
} from '@/bridge/methods/types/methods.js';
import type { Version } from '@/version/types.js';

import { supports } from './supports.js';

type HaveCheckSupportMethodTuple = {
  [M in MiniAppsMethodWithVersionedParams]: [M, MiniAppsMethodVersionedParams<M>]
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

const tests: [
  version: Version,
  methods: (MiniAppsMethodName | HaveCheckSupportMethodTuple)[],
][] = [
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
    ['web_app_open_link', 'try_instant_view'],
  ]],
  ['6.7', [
    'web_app_switch_inline_query',
  ]],
  ['6.9', [
    'web_app_invoke_custom_method',
    'web_app_request_write_access',
    'web_app_request_phone',
    ['web_app_set_header_color', 'color'],
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
];

tests.forEach(([version, methods]) => {
  const higher = increaseVersion(version, 1);
  const lower = increaseVersion(version, -1);

  methods.forEach((methodOrTuple) => {
    if (Array.isArray(methodOrTuple)) {
      const [method, param] = methodOrTuple;

      it(`should return true for method "${method}", parameter "${param}" and version >= ${version} (${higher})`, () => {
        expect(supports(method, param, version)).toBe(true);
        expect(supports(method, param, higher)).toBe(true);
      });

      it(`should return false for method "${method}", parameter "${param}" and version < ${version} (${lower})`, () => {
        expect(supports(method, param, lower)).toBe(false);
      });

      return;
    }

    const method = methodOrTuple;

    it(`should return true for "${method}" and version >= ${version} (${higher})`, () => {
      expect(supports(method, version)).toBe(true);
      expect(supports(method, higher)).toBe(true);
    });

    if (version !== '6.0') {
      it(`should return false for "${method}" and version < ${version} (${lower})`, () => {
        expect(supports(method, lower)).toBe(false);
      });
    }
  });
});
