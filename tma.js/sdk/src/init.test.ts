import { afterEach, vi, it, expect, beforeEach, describe } from 'vitest';
import { createWindow } from 'test-utils';
import { emitEvent } from '@tma.js/bridge';

import { mockMiniAppsEnv, resetPackageState } from '@test-utils/utils.js';
import { $postEvent, $launchParams } from '@/globals.js';

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

describe('global signals', () => {
  beforeEach(() => {
    createWindow({ env: 'iframe', location: { href: '' } as any });
  });

  it('should configure postEvent', () => {
    mockMiniAppsEnv();
    const postEvent = vi.fn();
    init({ postEvent });
    expect($postEvent()).toEqual(postEvent);
  });

  describe('launch params', () => {
    it('should use passed', () => {
      mockMiniAppsEnv();
      init({
        launchParams: {
          tgWebAppPlatform: 'desktop',
          tgWebAppThemeParams: {},
          tgWebAppVersion: '11',
        },
      });
      expect($launchParams()).toEqual({
        tgWebAppPlatform: 'desktop',
        tgWebAppThemeParams: {},
        tgWebAppVersion: '11',
      });
    });

    it('should retrieve from env if not passed', () => {
      mockMiniAppsEnv({
        tgWebAppPlatform: 'macos',
        tgWebAppThemeParams: {},
        tgWebAppVersion: '13',
      });
      init();
      expect($launchParams()).toEqual({
        tgWebAppPlatform: 'macos',
        tgWebAppThemeParams: {},
        tgWebAppVersion: '13',
      });
    });
  });

  it('should configure launch params', () => {
    init({
      launchParams: {
        tgWebAppPlatform: 'desktop',
        tgWebAppThemeParams: {},
        tgWebAppVersion: '11',
      },
    });
    expect($launchParams()).toEqual({
      tgWebAppPlatform: 'desktop',
      tgWebAppThemeParams: {},
      tgWebAppVersion: '11',
    });
  });
});

it('should listen to "reload_iframe" event, call "iframe_will_reload" method and window.location.reload on receive', () => {
  const reloadSpy = vi.fn();
  createWindow({ location: { reload: reloadSpy } as any });

  const postEvent = vi.fn();
  init({
    postEvent,
    launchParams: {
      tgWebAppVersion: '999',
      tgWebAppThemeParams: {},
      tgWebAppPlatform: 'tdesktop',
    },
  });

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

  init({
    postEvent: vi.fn(),
    launchParams: {
      tgWebAppVersion: '999',
      tgWebAppThemeParams: {},
      tgWebAppPlatform: 'tdesktop',
    },
  });
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
  const appendChild = vi.fn(c => style = c);
  const removeChild = vi.fn();

  createWindow({ location: { reload: reloadSpy } as any });
  vi.spyOn(global, 'document', 'get').mockImplementation(() => ({
    createElement,
    head: { appendChild, removeChild },
  }) as any);

  const postEvent = vi.fn();
  const cleanup = init({
    postEvent,
    launchParams: {
      tgWebAppVersion: '999',
      tgWebAppThemeParams: {},
      tgWebAppPlatform: 'tdesktop',
    },
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
