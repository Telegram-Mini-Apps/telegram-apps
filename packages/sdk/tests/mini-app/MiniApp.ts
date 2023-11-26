import { describe, expect, it, vi } from 'vitest';

import { RGB } from '~/colors/index.js';
import { MiniApp, MiniAppHeaderColor } from '~/mini-app/index.js';
import { PostEvent } from '~/bridge/index.js';

interface CreateWebAppOptions {
  backgroundColor?: RGB;
  botInline?: boolean;
  headerColor?: MiniAppHeaderColor;
  postEvent?: PostEvent;
  version?: string;
}

function createMiniApp(options: CreateWebAppOptions = {}): MiniApp {
  const {
    postEvent = vi.fn(),
    backgroundColor = '#000000',
    headerColor = 'bg_color',
    version = '6.0',
    botInline = false
  } = options;

  return new MiniApp({
    version,
    botInline,
    postEvent,
    headerColor,
    backgroundColor
  });
}

describe('setBackgroundColor', () => {
  it('should call "web_app_set_background_color" method with { color: {{color}} }', () => {
    const postEvent = vi.fn();
    const miniApp = createMiniApp({ postEvent });

    expect(postEvent).toHaveBeenCalledTimes(0);
    miniApp.setBackgroundColor('#ffaabb');
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_set_background_color', { color: '#ffaabb' });
  });

  it('should emit "change:backgroundColor" event with specified value', () => {
    const miniApp = createMiniApp({ backgroundColor: '#ffffff' });
    const listener = vi.fn();

    miniApp.on('change:backgroundColor', listener);
    expect(listener).toHaveBeenCalledTimes(0);
    miniApp.setBackgroundColor('#ffaacc');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('#ffaacc');
  });
});

describe('setHeaderColor', () => {
  it('should call "web_app_set_header_color" method with { color_key: {{color_key}} }', () => {
    const postEvent = vi.fn();
    const miniApp = createMiniApp({ postEvent, headerColor: 'bg_color' });

    expect(postEvent).toHaveBeenCalledTimes(0);
    miniApp.setHeaderColor('secondary_bg_color');
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_set_header_color', { color_key: 'secondary_bg_color' });
  });

  it('should emit "change:headerColor" event with specified value', () => {
    const miniApp = createMiniApp({ headerColor: 'bg_color' });
    const listener = vi.fn();

    miniApp.on('change:headerColor', listener);
    expect(listener).toHaveBeenCalledTimes(0);
    miniApp.setHeaderColor('secondary_bg_color');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('secondary_bg_color');
  });
});

describe('off', () => {
  describe('"change:backgroundColor" event', () => {
    it('should remove event listener from event', () => {
      const listener = vi.fn();
      const miniApp = createMiniApp({ backgroundColor: '#ffffff' });

      miniApp.on('change:backgroundColor', listener);

      expect(listener).toHaveBeenCalledTimes(0);
      miniApp.setBackgroundColor('#aaddcc');
      expect(listener).toHaveBeenCalledTimes(1);

      miniApp.off('change:backgroundColor', listener);
      listener.mockClear();

      expect(listener).toHaveBeenCalledTimes(0);
      miniApp.setBackgroundColor('#ffaaaa');
      expect(listener).toHaveBeenCalledTimes(0);
    });
  });

  describe('"change:headerColor" event', () => {
    it('should remove event listener from event', () => {
      const listener = vi.fn();
      const miniApp = createMiniApp({ headerColor: 'bg_color' });

      miniApp.on('change:headerColor', listener);

      expect(listener).toHaveBeenCalledTimes(0);
      miniApp.setHeaderColor('secondary_bg_color');
      expect(listener).toHaveBeenCalledTimes(1);

      miniApp.off('change:headerColor', listener);
      listener.mockClear();

      expect(listener).toHaveBeenCalledTimes(0);
      miniApp.setHeaderColor('bg_color');
      expect(listener).toHaveBeenCalledTimes(0);
    });
  });
});

describe('supports', () => {
  describe('setHeaderColor / setBackgroundColor', () => {
    it('should return true in case, WebApp version is 6.1 or higher. False, otherwise', () => {
      const miniApp1 = createMiniApp({ version: '6.0' });
      expect(miniApp1.supports('setHeaderColor')).toBe(false);
      expect(miniApp1.supports('setBackgroundColor')).toBe(false);

      const miniApp2 = createMiniApp({ version: '6.1' });
      expect(miniApp2.supports('setHeaderColor')).toBe(true);
      expect(miniApp2.supports('setBackgroundColor')).toBe(true);

      const miniApp3 = createMiniApp({ version: '6.2' });
      expect(miniApp3.supports('setHeaderColor')).toBe(true);
      expect(miniApp3.supports('setBackgroundColor')).toBe(true);
    });
  });
});
