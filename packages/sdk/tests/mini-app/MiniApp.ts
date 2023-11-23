import { describe, expect, it, vi } from 'vitest';

import { RGB } from '~/colors/index.js';
import { MiniApp, MiniAppHeaderColor } from '~/mini-app/index.js';
import { PostEvent } from '~/bridge/index.js';
import { CreateRequestIdFunc, Platform } from '~/types/index.js';
import { createRequestIdGenerator } from '~/init/creators/index.js';

interface CreateWebAppOptions {
  backgroundColor?: RGB;
  botInline?: boolean;
  createRequestId?: CreateRequestIdFunc;
  headerColor?: MiniAppHeaderColor;
  platform?: Platform;
  postEvent?: PostEvent;
  version?: string;
}

function createWebApp(options: CreateWebAppOptions = {}): MiniApp {
  const {
    postEvent = vi.fn(),
    backgroundColor = '#000000',
    headerColor = 'bg_color',
    version = '6.0',
    platform = 'web',
    createRequestId= createRequestIdGenerator(),
    botInline = false
  } = options;

  return new MiniApp(
    headerColor,
    backgroundColor,
    version,
    platform,
    botInline,
    createRequestId,
    postEvent,
  );
}

describe('colorScheme', () => {
  it('should return "dark" in case, WebApp background color is recognized as dark. "light" otherwise', () => {
    const webApp = createWebApp({ backgroundColor: '#000000' });

    expect(webApp.colorScheme).toBe('dark');
    webApp.setBackgroundColor('#ffffff');
    expect(webApp.colorScheme).toBe('light');
  });
});

describe('setBackgroundColor', () => {
  it('should call "web_app_set_background_color" method with { color: {{color}} }', () => {
    const postEvent = vi.fn();
    const webApp = createWebApp({ postEvent });

    expect(postEvent).toHaveBeenCalledTimes(0);
    webApp.setBackgroundColor('#ffaabb');
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_set_background_color', { color: '#ffaabb' });
  });

  it('should emit "backgroundColorChanged" event with specified value', () => {
    const webApp = createWebApp({ backgroundColor: '#ffffff' });
    const listener = vi.fn();

    webApp.on('backgroundColorChanged', listener);
    expect(listener).toHaveBeenCalledTimes(0);
    webApp.setBackgroundColor('#ffaacc');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('#ffaacc');
  });
});

describe('setHeaderColor', () => {
  it('should call "web_app_set_header_color" method with { color_key: {{color_key}} }', () => {
    const postEvent = vi.fn();
    const webApp = createWebApp({ postEvent, headerColor: 'bg_color' });

    expect(postEvent).toHaveBeenCalledTimes(0);
    webApp.setHeaderColor('secondary_bg_color');
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_set_header_color', { color_key: 'secondary_bg_color' });
  });

  it('should emit "headerColorChanged" event with specified value', () => {
    const webApp = createWebApp({ headerColor: 'bg_color' });
    const listener = vi.fn();

    webApp.on('headerColorChanged', listener);
    expect(listener).toHaveBeenCalledTimes(0);
    webApp.setHeaderColor('secondary_bg_color');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('secondary_bg_color');
  });
});

describe('off', () => {
  describe('"backgroundColorChanged" event', () => {
    it('should remove event listener from event', () => {
      const listener = vi.fn();
      const webApp = createWebApp({ backgroundColor: '#ffffff' });

      webApp.on('backgroundColorChanged', listener);

      expect(listener).toHaveBeenCalledTimes(0);
      webApp.setBackgroundColor('#aaddcc');
      expect(listener).toHaveBeenCalledTimes(1);

      webApp.off('backgroundColorChanged', listener);
      listener.mockClear();

      expect(listener).toHaveBeenCalledTimes(0);
      webApp.setBackgroundColor('#ffaaaa');
      expect(listener).toHaveBeenCalledTimes(0);
    });
  });

  describe('"headerColorChanged" event', () => {
    it('should remove event listener from event', () => {
      const listener = vi.fn();
      const webApp = createWebApp({ headerColor: 'bg_color' });

      webApp.on('headerColorChanged', listener);

      expect(listener).toHaveBeenCalledTimes(0);
      webApp.setHeaderColor('secondary_bg_color');
      expect(listener).toHaveBeenCalledTimes(1);

      webApp.off('headerColorChanged', listener);
      listener.mockClear();

      expect(listener).toHaveBeenCalledTimes(0);
      webApp.setHeaderColor('bg_color');
      expect(listener).toHaveBeenCalledTimes(0);
    });
  });
});

describe('supports', () => {
  describe('setHeaderColor / setBackgroundColor', () => {
    it('should return true in case, WebApp version is 6.1 or higher. False, otherwise', () => {
      const webApp1 = createWebApp({ version: '6.0' });
      expect(webApp1.supports('setHeaderColor')).toBe(false);
      expect(webApp1.supports('setBackgroundColor')).toBe(false);

      const webApp2 = createWebApp({ version: '6.1' });
      expect(webApp2.supports('setHeaderColor')).toBe(true);
      expect(webApp2.supports('setBackgroundColor')).toBe(true);

      const webApp3 = createWebApp({ version: '6.2' });
      expect(webApp3.supports('setHeaderColor')).toBe(true);
      expect(webApp3.supports('setBackgroundColor')).toBe(true);
    });
  });
});
