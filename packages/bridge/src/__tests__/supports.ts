import {describe, expect, it} from '@jest/globals';
import {supports} from '../supports';
import {PostEventName} from '../posting';

describe('support', () => {
  describe('supports', () => {
    const methods61: PostEventName[] = [
      'web_app_open_tg_link', 'web_app_open_invoice', 'web_app_setup_back_button',
      'web_app_set_background_color', 'web_app_set_header_color',
      'web_app_trigger_haptic_feedback',
    ];
    const methods62: PostEventName[] = ['web_app_open_popup'];
    const methods64: PostEventName[] = [
      'web_app_read_text_from_clipboard', 'web_app_close_scan_qr_popup',
      'web_app_close_scan_qr_popup',
    ];
    const methodsAny: PostEventName[] = [
      'iframe_ready', 'web_app_close', 'web_app_data_send', 'web_app_expand',
      'web_app_open_link', 'web_app_ready', 'web_app_request_theme',
      'web_app_request_viewport', 'web_app_setup_main_button',
      'web_app_setup_closing_behavior',
    ];

    methods61.forEach(method => {
      it(`should return true in case, passed method is "${method}" and version is 6.1 or more`, () => {
        expect(supports(method, '6.1')).toBe(true);
        expect(supports(method, '6.2')).toBe(true);
      });

      it(`should return false in case, passed method is "${method}" and version is lower than 6.1`, () => {
        expect(supports(method, '6.0')).toBe(false);
      });
    });

    methods62.forEach(method => {
      it(`should return true in case, passed method is "${method}" and version is 6.2 or more`, () => {
        expect(supports(method, '6.2')).toBe(true);
        expect(supports(method, '6.3')).toBe(true);
      });

      it(`should return false in case, passed method is "${method}" and version is lower than 6.2`, () => {
        expect(supports(method, '6.0')).toBe(false);
      });
    });

    methods64.forEach(method => {
      it(`should return true in case, passed method is "${method}" and version is 6.4 or more`, () => {
        expect(supports(method, '6.4')).toBe(true);
        expect(supports(method, '6.5')).toBe(true);
      });

      it(`should return false in case, passed method is "${method}" and version is lower than 6.4`, () => {
        expect(supports(method, '6.3')).toBe(false);
      });
    });

    methodsAny.forEach(method => {
      it(`should return true in case, passed method is "${method}" and version is 1`, () => {
        expect(supports(method, '1')).toBe(true);
      });
    });
  });
});