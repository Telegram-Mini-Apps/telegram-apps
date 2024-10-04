import { afterEach, vi, it, expect, beforeEach } from 'vitest';
// import { resetMiniAppsEventEmitter } from '@/bridge/events/event-emitter/singleton.js';
// import { postEvent as postEventFn } from '@/bridge/methods/postEvent.js';
// import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';
// import { createWindow } from '@test-utils/createWindow.js';
// import { mockDocument } from 'test-utils';
import { createWindow, dispatchMiniAppsEvent, mockDocument } from 'test-utils';

import { resetPackageState } from '@test-utils/reset/reset.js';
import { $postEvent, $version } from '@/scopes/globals.js';

import { init } from './init.js';

vi.mock('@/scopes/globals/globals.js', async () => {
  const actual = await vi.importActual('@/scopes/globals/globals.js');

  return {
    ...actual,
    configure: vi.fn(actual.configure as any),
  };
});

beforeEach(() => {
  resetPackageState();
  createWindow();
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('should call configure with options passed to init', () => {
  const postEvent = () => {
  };
  const options = {
    postEvent,
    version: '999',
  };
  init(options);

  expect($postEvent()).toEqual(postEvent);
  expect($version()).toEqual('999');
});

it('should define Telegram event handlers', () => {
  init({
    postEvent() {
    },
    version: '999',
  });
  const wnd = window as any;
  expect(wnd.TelegramGameProxy_receiveEvent).toBeDefined();
  expect(wnd.TelegramGameProxy.receiveEvent).toBeDefined();
  expect(wnd.Telegram.WebView.receiveEvent).toBeDefined();
});

it('should listen to "reload_iframe" event, call "iframe_will_reload" method and window.location.reload on receive', () => {
  const reloadSpy = vi.fn();
  createWindow({ location: { reload: reloadSpy } as any });

  const postEvent = vi.fn();
  init({
    postEvent,
    version: '999',
  });

  expect(postEvent).toHaveBeenCalledOnce();
  expect(postEvent).toHaveBeenCalledWith('iframe_ready', { reload_supported: true });
  postEvent.mockClear();

  dispatchMiniAppsEvent('reload_iframe');
  expect(postEvent).toHaveBeenCalledOnce();
  expect(postEvent).toHaveBeenCalledWith('iframe_will_reload', undefined);
  expect(reloadSpy).toHaveBeenCalledOnce();
});

it('should append to document.head <style/> element with id "telegram-custom-styles", containing styles from received "set_custom_style" event', () => {
  let style: any;
  const createElement = vi.fn(() => ({}));
  const appendChild = vi.fn((c) => style = c);
  mockDocument({
    createElement,
    head: { appendChild },
  } as any);

  init({
    postEvent() {
    },
    version: '999',
  });
  expect(createElement).toHaveBeenCalledOnce();
  expect(createElement).toHaveBeenCalledWith('style');
  expect(appendChild).toHaveBeenCalledOnce();
  expect(appendChild).toHaveBeenCalledWith({ id: 'telegram-custom-styles' });

  dispatchMiniAppsEvent('set_custom_style', '.root{}');
  expect(style.innerHTML).toBe('.root{}');
});

it('should remove "reload_iframe" and "set_custom_style" event listeners, remove appended <style/> element if returned function was called', () => {
  let style: any;
  const reloadSpy = vi.fn();
  const createElement = vi.fn(() => ({}));
  const appendChild = vi.fn((c) => style = c);
  const removeChild = vi.fn();

  createWindow({ location: { reload: reloadSpy } as any });
  mockDocument({
    createElement,
    head: { appendChild, removeChild },
  } as any);

  const postEvent = vi.fn();
  const cleanup = init({
    postEvent,
    version: '999',
  });

  // Check if style element was created and appended.
  expect(createElement).toHaveBeenCalledOnce();
  expect(createElement).toHaveBeenCalledWith('style');
  expect(appendChild).toHaveBeenCalledOnce();
  expect(appendChild).toHaveBeenCalledWith({ id: 'telegram-custom-styles' });

  // Check if postEvent function was called only with "iframe_ready".
  expect(postEvent).toHaveBeenCalledOnce();
  expect(postEvent).toHaveBeenCalledWith('iframe_ready', { reload_supported: true });

  // Perform cleanup and check if event listeners were removed, as well as create style tag.
  cleanup();

  expect(removeChild).toHaveBeenCalledOnce();
  expect(removeChild).toHaveBeenCalledWith(style);

  dispatchMiniAppsEvent('reload_iframe');
  dispatchMiniAppsEvent('set_custom_style', '.root{}');

  expect(postEvent).toHaveBeenCalledOnce();
  expect(reloadSpy).not.toHaveBeenCalled();
  expect(style).toStrictEqual({ id: 'telegram-custom-styles' });
});