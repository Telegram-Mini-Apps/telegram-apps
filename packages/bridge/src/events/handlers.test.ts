import { it, expect, vi, afterEach, describe } from 'vitest';
import { mockWindow } from 'test-utils';

import { removeEventHandlers, defineEventHandlers, emitMiniAppsEvent } from './handlers.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('cleanupEventHandlers', () => {
  it('should delete window properties: TelegramGameProxy_receiveEvent, TelegramGameProxy, Telegram', () => {
    const wnd = {
      TelegramGameProxy_receiveEvent: {},
      TelegramGameProxy: { receiveEvent: {} },
      Telegram: { WebView: { receiveEvent: {} } },
    };
    mockWindow(wnd as any);
    removeEventHandlers();
    expect(wnd).toStrictEqual({});
  });
});

describe('defineEventHandlers', () => {
  it('should should specify emitMiniAppsEvent function by paths [window.TelegramGameProxy_receiveEvent, window.TelegramGameProxy.receiveEvent, window.Telegram.WebView.receiveEvent]', () => {
    const wnd = {};
    mockWindow(wnd as any);
    defineEventHandlers();
    expect(wnd).toStrictEqual({
      TelegramGameProxy_receiveEvent: emitMiniAppsEvent,
      TelegramGameProxy: { receiveEvent: emitMiniAppsEvent },
      Telegram: { WebView: { receiveEvent: emitMiniAppsEvent } },
    });
  });
});

describe('emitMiniAppsEvent', () => {
  it('should call window.dispatchEvent with the Message event containing properties "data" property equal to { eventType, eventData } stringified and "source" property equal to window.parent', () => {
    const dispatchEvent = vi.fn();
    mockWindow({
      dispatchEvent,
      parent: 'PARENT'
    } as any);
    emitMiniAppsEvent('test', 'some-data');
    expect(dispatchEvent).toHaveBeenCalledOnce();
    expect(dispatchEvent.mock.calls[0][0]).toBeInstanceOf(MessageEvent);
    expect(dispatchEvent.mock.calls[0][0]).toMatchObject({
      type: 'message',
      data: '{"eventType":"test","eventData":"some-data"}',
      source: 'PARENT' as any,
    });
  });
});
