import { afterEach, describe, expect, it, vi } from 'vitest';
import { createWindow } from 'test-utils';

import { resetPackageState } from '@/resetPackageState.js';
import { emitMiniAppsEvent } from '@/events/emitMiniAppsEvent.js';

import { off, on } from './emitter.js';

afterEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
});

describe('on', () => {
  it('should call listener if event was emitted', () => {
    const listener = vi.fn();
    on('viewport_changed', listener);

    const eventData = {
      height: 123,
      width: 321,
      is_expanded: false,
      is_state_stable: false,
    };
    emitMiniAppsEvent('viewport_changed', eventData);
    emitMiniAppsEvent('theme_changed', { theme_params: {} });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(eventData);
  });

  it('should remove listener after being called if "once" option was passed', () => {
    const listener = vi.fn();
    on('viewport_changed', listener, true);

    const eventData = {
      height: 123,
      width: 321,
      is_expanded: false,
      is_state_stable: false,
    };
    emitMiniAppsEvent('viewport_changed', eventData);
    emitMiniAppsEvent('viewport_changed', eventData);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should remove listener if returned callback was called', () => {
    const listener = vi.fn();
    const emit = () => emitMiniAppsEvent('viewport_changed', {
      height: 123,
      width: 321,
      is_expanded: false,
      is_state_stable: false,
    });

    const off = on('viewport_changed', listener);
    emit();
    expect(listener).toHaveBeenCalledTimes(1);

    off();
    emit();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should subscribe to all events if "*" passed', () => {
    const listener = vi.fn();
    on('*', listener);

    emitMiniAppsEvent('viewport_changed', {
      height: 123,
      width: 321,
      is_expanded: false,
      is_state_stable: false,
    });
    emitMiniAppsEvent('theme_changed', { theme_params: {} });

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenNthCalledWith(1, ['viewport_changed', {
      height: 123,
      width: 321,
      is_expanded: false,
      is_state_stable: false,
    }]);
    expect(listener).toHaveBeenNthCalledWith(2, ['theme_changed', { theme_params: {} }]);
  });

  it('should define mini apps event listeners', () => {
    createWindow();
    expect(window).not.toHaveProperty('TelegramGameProxy_receiveEvent');
    expect(window).not.toHaveProperty('TelegramGameProxy');
    expect(window).not.toHaveProperty('Telegram');
    on('*', vi.fn());
    expect(window).toMatchObject({
      TelegramGameProxy_receiveEvent: emitMiniAppsEvent,
      TelegramGameProxy: { receiveEvent: emitMiniAppsEvent },
      Telegram: { WebView: { receiveEvent: emitMiniAppsEvent } },
    });
  });

  describe('events process', () => {
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
      {
        event: 'clipboard_text_received',
        input: { req_id: 'request id', data: 'clipboard value' },
      },
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
      const { event } = test;

      if ('cases' in test) {
        test.cases?.forEach(([input, expected = input], idx) => {
          it(`should properly process case ${idx}`, () => {
            const listener = vi.fn();
            on(event as any, listener);
            emitMiniAppsEvent(event, input);
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(expected);
          });
        });
        return;
      }

      it('should properly process event', () => {
        const listener = vi.fn();
        on(event as any, listener);
        emitMiniAppsEvent(event, test.input);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(test.input);
      });
    });
  });
});

describe('off', () => {
  it('should remove listener', () => {
    const listener = vi.fn();
    const emit = () => emitMiniAppsEvent('viewport_changed', {
      height: 123,
      width: 321,
      is_expanded: false,
      is_state_stable: false,
    });

    on('viewport_changed', listener);
    emit();
    expect(listener).toHaveBeenCalledTimes(1);

    off('viewport_changed', listener);
    emit();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should remove mini apps event listeners when no listeners left', () => {
    createWindow();
    expect(window).not.toHaveProperty('TelegramGameProxy_receiveEvent');
    expect(window).not.toHaveProperty('TelegramGameProxy');
    expect(window).not.toHaveProperty('Telegram');
    const listener = vi.fn();
    on('*', listener);
    expect(window).toMatchObject({
      TelegramGameProxy_receiveEvent: emitMiniAppsEvent,
      TelegramGameProxy: { receiveEvent: emitMiniAppsEvent },
      Telegram: { WebView: { receiveEvent: emitMiniAppsEvent } },
    });
    off('*', listener);
    expect(window).not.toHaveProperty('TelegramGameProxy_receiveEvent');
    expect(window).not.toHaveProperty('TelegramGameProxy');
    expect(window).not.toHaveProperty('Telegram');
  });
});