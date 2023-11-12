import { describe, expect, it } from 'vitest';
import type { Version } from '@tma.js/utils';

import { supports } from '../src/supports.js';
import type {
  MethodName,
  HasCheckSupportKeyMethod,
  HasCheckSupportMethodParam,
} from '../src/index.js';

type HaveCheckSupportMethodTuple = {
  [M in HasCheckSupportKeyMethod]: [M, HasCheckSupportMethodParam<M>]
}[HasCheckSupportKeyMethod];

/**
 * Increases specified version by amount of updates.
 * @param version - initial version.
 * @param amount - count of bumps.
 */
function increaseVersion(version: Version, amount: number): string {
  const match = version.match(/(.+\.)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid version: ${version}`);
  }
  return `${match[1]}${parseInt(match[2], 10) + amount}`;
}

describe('supports', () => {
  const tests: [
    version: Version | 'any',
    methods: (MethodName | HaveCheckSupportMethodTuple)[],
  ][] = [
    ['any', [
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
  ];

  tests.forEach(([version, methods]) => {
    if (version === 'any') {
      methods.forEach((methodOrTuple) => {
        if (Array.isArray(methodOrTuple)) {
          const [method, param] = methodOrTuple;
          it(`should return true in case, passed method is "${method}", parameter is "${param}" and version is 1`, () => {
            expect(supports(method, param, '1')).toBe(true);
          });

          return;
        }

        const method = methodOrTuple;
        it(`should return true in case, passed method is "${method}" and version is 1`, () => {
          expect(supports(method, '1')).toBe(true);
        });
      });
      return;
    }

    methods.forEach((methodOrTuple) => {
      if (Array.isArray(methodOrTuple)) {
        const [method, param] = methodOrTuple;

        it(`should return true in case, passed method is "${method}", parameter is "${param}" and version is ${version} or higher`, () => {
          expect(supports(method, param, version)).toBe(true);
          expect(supports(method, param, increaseVersion(version, 1))).toBe(true);
        });

        it(`should return false in case, passed method is "${method}", parameter is "${param}" and version is lower than ${version}`, () => {
          expect(supports(method, param, increaseVersion(version, -1))).toBe(false);
        });

        return;
      }

      const method = methodOrTuple;

      it(`should return true in case, passed method is "${method}" and version is ${version} or higher`, () => {
        expect(supports(method, version)).toBe(true);
        expect(supports(method, increaseVersion(version, 1))).toBe(true);
      });

      it(`should return false in case, passed method is "${method}" and version is lower than ${version}`, () => {
        expect(supports(method, increaseVersion(version, -1))).toBe(false);
      });
    });
  });
});
