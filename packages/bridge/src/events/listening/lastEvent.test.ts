import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchMiniAppsEvent, createWindow, type WindowSpy } from 'test-utils';

import { lastEventSignal } from '@/events/listening/lastEvent.js';
import { resetPackageState } from '@/resetPackageState.js';

let windowSpy: WindowSpy;

beforeEach(() => {
  windowSpy = createWindow({
    innerWidth: 1920,
    innerHeight: 1080,
  });
});

afterEach(() => {
  windowSpy.mockRestore();
  resetPackageState();
});

it('should emit "viewport_changed" event in case, window changed its size', () => {
  const spy = vi.fn();
  lastEventSignal().sub(spy);

  window.dispatchEvent(new CustomEvent('resize'));

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(['viewport_changed', {
    width: 1920,
    height: 1080,
    is_state_stable: true,
    is_expanded: true,
  }], undefined);
});

it('should not emit event in case, it contains incorrect payload', () => {
  const spy = vi.fn();
  lastEventSignal().sub(spy);
  dispatchMiniAppsEvent('viewport_changed', 'broken data');
  expect(spy).not.toBeCalled();
});

describe.each([
  {
    event: 'viewport_changed',
    input: {
      height: 120,
      width: 300,
      is_expanded: true,
      is_state_stable: false,
    },
  },
  {
    event: 'theme_changed',
    input: {
      theme_params: {
        bg_color: '#aabbdd',
        text_color: '#113322',
        hint_color: '#132245',
        link_color: '#133322',
        button_color: '#a23135',
        button_text_color: '#aa213f',
      },
    },
  },
  {
    event: 'popup_closed',
    cases: [
      [{ button_id: 'ok' }, { button_id: 'ok' }],
      [{ button_id: null }, {}],
      [{ button_id: undefined }, {}],
      [null, {}],
      [undefined, {}],
    ],
  },
  { event: 'set_custom_style', input: '.scroll {}' },
  { event: 'qr_text_received', input: { data: 'some QR data' } },
  { event: 'main_button_pressed' },
  { event: 'back_button_pressed' },
  { event: 'settings_button_pressed' },
  { event: 'scan_qr_popup_closed' },
  { event: 'clipboard_text_received', input: { req_id: 'request id', data: 'clipboard value' } },
  { event: 'invoice_closed', input: { slug: '&&*Sh1j213kx', status: 'PAID' } },
  { event: 'phone_requested', input: { status: 'sent' } },
  {
    event: 'custom_method_invoked',
    cases: [
      [{ req_id: '1', result: 'My result' }],
      [{ req_id: '2', error: 'Something is wrong' }],
    ],
  },
  { event: 'write_access_requested', input: { status: 'allowed' } },
  {
    event: 'unknown_event',
    cases: [
      ['hello', 'hello'],
      [{ there: true }, { there: true }],
    ],
  },
])('$event', test => {
  if ('cases' in test) {
    test.cases?.forEach(([input, expected = input], idx) => {
      it(`should properly process case ${idx}`, () => {
        const spy = vi.fn();
        lastEventSignal().sub(spy);
        dispatchMiniAppsEvent(test.event, input);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith([test.event, expected], undefined);
      });
    });
    return;
  }

  it('should properly process event', () => {
    const spy = vi.fn();
    lastEventSignal().sub(spy);
    dispatchMiniAppsEvent(test.event, test.input);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith([test.event, test.input], undefined);
  });
  return;
});
