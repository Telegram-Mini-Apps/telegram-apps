import { createWindow, type WindowSpy } from '@test-utils/createWindow.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createEmitter } from './createEmitter.js';
import type { MiniAppsEventName, MiniAppsEventParams } from './types/events.js';

type TestCase<E extends MiniAppsEventName> =
  | [input: any, expected: MiniAppsEventParams<E>]
  | MiniAppsEventParams<E>;

type TestCases = {
  [E in MiniAppsEventName]: MiniAppsEventParams<E> extends undefined
    ? [E]
    : [E, TestCase<E> | TestCase<E>[]];
}[MiniAppsEventName][];

let windowSpy: WindowSpy;

beforeEach(() => {
  windowSpy = createWindow({
    innerWidth: 1920,
    innerHeight: 1080,
  });
});

afterEach(() => {
  windowSpy.mockRestore();
});

it('should emit "viewport_changed" event in case, window changed its size', () => {
  const emitter = createEmitter();
  const spy = vi.fn();

  emitter.on('viewport_changed', spy);

  window.dispatchEvent(new CustomEvent('resize'));

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith({
    width: 1920,
    height: 1080,
    is_state_stable: true,
    is_expanded: true,
  });
});

describe('events handling', () => {
  const testCases: TestCases = [
    ['viewport_changed', {
      height: 120,
      width: 300,
      is_expanded: true,
      is_state_stable: false,
    }],
    ['theme_changed', {
      theme_params: {
        bg_color: '#aabbdd',
        text_color: '#113322',
        hint_color: '#132245',
        link_color: '#133322',
        button_color: '#a23135',
        button_text_color: '#aa213f',
      },
    }],
    ['popup_closed', [
      [{ button_id: 'ok' }, { button_id: 'ok' }],
      [{ button_id: null }, {}],
      [{ button_id: undefined }, {}],
      [null, {}],
      [undefined, {}],
    ]],
    ['set_custom_style', '.scroll {}'],
    ['qr_text_received', { data: 'some QR data' }],
    ['main_button_pressed'],
    ['back_button_pressed'],
    ['settings_button_pressed'],
    ['scan_qr_popup_closed'],
    ['clipboard_text_received', {
      req_id: 'request id',
      data: 'clipboard value',
    }],
    ['invoice_closed', { slug: '&&*Sh1j213kx', status: 'PAID' }],
    ['phone_requested', { status: 'sent' }],
    ['custom_method_invoked', [
      [{ req_id: '1', result: 'My result' }],
      [{ req_id: '2', error: 'Something is wrong' }],
    ]],
    ['write_access_requested', { status: 'allowed' }],
    ['unknown_event', [
      ['hello', 'hello'],
      [{ there: true }, { there: true }],
    ]] as any,
  ];

  testCases.forEach(([event, inputOrCaseOrCases]) => {
    it(`should correctly handle "${event}" event data`, () => {
      const spy = vi.fn();
      const emitter = createEmitter();

      emitter.on(event, spy);

      // No expected data to be passed to listener.
      if (inputOrCaseOrCases === undefined) {
        dispatchWindowMessageEvent(event);
        expect(spy).toBeCalledWith();
        return;
      }

      // Input is equal to expected result.
      if (!Array.isArray(inputOrCaseOrCases)) {
        dispatchWindowMessageEvent(event, inputOrCaseOrCases);
        expect(spy).toBeCalledWith(inputOrCaseOrCases);
        return;
      }

      // Input differs from expected result.
      if (!Array.isArray(inputOrCaseOrCases[0])) {
        const [input, expected] = inputOrCaseOrCases;
        dispatchWindowMessageEvent(event, input);
        expect(spy).toBeCalledWith(expected);
        return;
      }

      // List of cases.
      inputOrCaseOrCases.forEach(([input, expected = input]) => {
        dispatchWindowMessageEvent(event, input);
        expect(spy).toBeCalledWith(expected);
      });
    });
  });

  it('should not emit event in case, it contains incorrect payload', () => {
    const spy = vi.fn();
    const emitter = createEmitter();

    emitter.on('viewport_changed', spy);

    dispatchWindowMessageEvent('viewport_changed', 'broken data');

    expect(spy).not.toBeCalled();
  });
});
