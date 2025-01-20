import { afterEach, vi, it, expect, beforeEach } from 'vitest';
import { createWindow } from 'test-utils';
import { emitEvent } from '@telegram-apps/bridge';

import { resetPackageState } from '@test-utils/resetPackageState.js';
import { $postEvent, version } from '@/globals.js';

import { init } from './init.js';

vi.mock('@/globals.js', async () => {
  const actual = await vi.importActual('@/globals.js');
  return { ...actual, configure: vi.fn(actual.configure as any) };
});

beforeEach(() => {
  resetPackageState();
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('should call configure with options passed to init', () => {
  createWindow();
  const postEvent = vi.fn();
  init({ postEvent, version: '999' });
  expect($postEvent()).toEqual(postEvent);
  expect(version()).toEqual('999');
});

it('should listen to "reload_iframe" event, call "iframe_will_reload" method and window.location.reload on receive', () => {
  const reloadSpy = vi.fn();
  createWindow({ location: { reload: reloadSpy } as any });

  const postEvent = vi.fn();
  init({ postEvent, version: '999' });

  expect(postEvent).toHaveBeenCalledOnce();
  expect(postEvent).toHaveBeenCalledWith('iframe_ready', { reload_supported: true });
  postEvent.mockClear();

  emitEvent('reload_iframe');
  expect(postEvent).toHaveBeenCalledOnce();
  expect(postEvent).toHaveBeenCalledWith('iframe_will_reload', undefined);
  expect(reloadSpy).toHaveBeenCalledOnce();
});

it('should append to document.head <style/> element with id "telegram-custom-styles", containing styles from received "set_custom_style" event', () => {
  let style: any;
  const createElement = vi.fn(() => ({}));
  const appendChild = vi.fn(c => style = c);

  vi.spyOn(global, 'document', 'get').mockImplementation(() => ({
    createElement,
    head: { appendChild },
  }) as any);

  init({ postEvent: vi.fn(), version: '999' });
  expect(createElement).toHaveBeenCalledOnce();
  expect(createElement).toHaveBeenCalledWith('style');
  expect(appendChild).toHaveBeenCalledOnce();
  expect(appendChild).toHaveBeenCalledWith({ id: 'telegram-custom-styles' });

  emitEvent('set_custom_style', '.root{}');
  expect(style.innerHTML).toBe('.root{}');
});

it('should remove "reload_iframe" and "set_custom_style" event listeners, remove appended <style/> element if returned function was called', () => {
  let style: any;
  const reloadSpy = vi.fn();
  const createElement = vi.fn(() => ({}));
  const appendChild = vi.fn((c) => style = c);
  const removeChild = vi.fn();

  createWindow({ location: { reload: reloadSpy } as any });
  vi.spyOn(global, 'document', 'get').mockImplementation(() => ({
    createElement,
    head: { appendChild, removeChild },
  }) as any);

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

  emitEvent('reload_iframe');
  emitEvent('set_custom_style', '.root{}');

  expect(postEvent).toHaveBeenCalledOnce();
  expect(reloadSpy).not.toHaveBeenCalled();
  expect(style).toStrictEqual({ id: 'telegram-custom-styles' });
});