import { supports, MethodName } from '../src/index.js';

type Version = `${number}.${number}`;
type Test = [version: Version | 'any', methods: MethodName | MethodName[]];

/**
 * Increases specified version by amount of updates.
 * @param version - initial version.
 * @param amount - count of bumps to add.
 */
function increaseVersion(version: Version, amount: number): string {
  const lastDotIndex = version.lastIndexOf('.');
  const lastPart = parseInt(version.slice(lastDotIndex + 1), 10);

  if (Number.isNaN(lastPart)) {
    throw new Error(`Invalid version: ${version}`);
  }

  return `${version.slice(0, lastDotIndex + 1)}${lastPart + amount}`;
}

describe('supports.ts', () => {
  describe('supports', () => {
    const tests: Test[] = [
      ['any', [
        'iframe_ready', 'web_app_close', 'web_app_data_send', 'web_app_expand',
        'web_app_open_link', 'web_app_ready', 'web_app_request_theme',
        'web_app_request_viewport', 'web_app_setup_main_button',
        'web_app_setup_closing_behavior',
      ]],
      ['6.1', [
        'web_app_open_tg_link', 'web_app_open_invoice', 'web_app_setup_back_button',
        'web_app_set_background_color', 'web_app_set_header_color',
        'web_app_trigger_haptic_feedback',
      ]],
      ['6.2', 'web_app_open_popup'],
      ['6.4', [
        'web_app_read_text_from_clipboard', 'web_app_close_scan_qr_popup',
        'web_app_close_scan_qr_popup',
      ]],
      ['6.9', [
        'web_app_invoke_custom_method', 'web_app_request_write_access', 'web_app_request_phone',
      ]],
    ];

    tests.forEach(([version, methodsOrMethod]) => {
      const methods = Array.isArray(methodsOrMethod) ? methodsOrMethod : [methodsOrMethod];

      if (version === 'any') {
        methods.forEach((method) => {
          it(`should return true in case, passed method is "${method}" and version is 1`, () => {
            expect(supports(method, '1')).toBe(true);
          });
        });
        return;
      }

      methods.forEach((method) => {
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
});
