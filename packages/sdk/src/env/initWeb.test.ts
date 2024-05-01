import { afterEach, vi, it, expect } from 'vitest';
import { resetMiniAppsEventEmitter } from '@/bridge/events/event-emitter/singleton.js';
import { initWeb } from '@/env/initWeb.js';
import { postEvent as postEventFn } from '@/bridge/methods/postEvent.js';
import { FnToSpy } from '@test-utils/types.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';
import { createWindow } from '@test-utils/createWindow.js';
import { mockDocument } from 'test-utils';

const postEvent = postEventFn as unknown as FnToSpy<typeof postEventFn>;

vi.mock('@/bridge/methods/postEvent.js', () => {
  return {
    postEvent: vi.fn(),
  };
});

afterEach(() => {
  resetMiniAppsEventEmitter();
  vi.restoreAllMocks();
});

it('should create "reload_iframe" event listener, calling "iframe_will_reload" method and window.location.reload', () => {
  const reloadSpy = vi.fn();
  createWindow({ location: { reload: reloadSpy } as any });

  initWeb();

  expect(postEvent).toHaveBeenCalledOnce();
  expect(postEvent).toHaveBeenCalledWith('iframe_ready', { reload_supported: true });
  postEvent.mockClear();

  dispatchWindowMessageEvent('reload_iframe');
  expect(postEvent).toHaveBeenCalledOnce();
  expect(postEvent).toHaveBeenCalledWith('iframe_will_reload');
  expect(reloadSpy).toHaveBeenCalledOnce();
});

it('should append to document.head <style/> element with id "telegram-custom-styles", containing styles from the received "set_custom_style" event', () => {
  let style: any;
  const createElement = vi.fn(() => ({}));
  const appendChild = vi.fn((c) => style = c);
  createWindow();
  mockDocument({ createElement, head: { appendChild } } as any);

  initWeb(true);
  expect(createElement).toHaveBeenCalledOnce();
  expect(createElement).toHaveBeenCalledWith('style');
  expect(appendChild).toHaveBeenCalledOnce();
  expect(appendChild).toHaveBeenCalledWith({ id: 'telegram-custom-styles' });

  dispatchWindowMessageEvent('set_custom_style', '.root{}');
  expect(style.innerHTML).toBe('.root{}');
});

it('should remove "reload_iframe" and "set_custom_style" event listeners, remove appended <style/> element if returned function was called', () => {
  let style: any;
  const reloadSpy = vi.fn();
  const createElement = vi.fn(() => ({}));
  const appendChild = vi.fn((c) => style = c);
  const removeChild = vi.fn();
  createWindow({ location: { reload: reloadSpy } as any });
  mockDocument({ createElement, head: { appendChild, removeChild } } as any);
  const cleanup = initWeb(true);

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

  dispatchWindowMessageEvent('reload_iframe');
  dispatchWindowMessageEvent('set_custom_style', '.root{}');

  expect(postEvent).toHaveBeenCalledOnce();
  expect(reloadSpy).not.toHaveBeenCalled();
  expect(style).toStrictEqual({ id: 'telegram-custom-styles' });
});