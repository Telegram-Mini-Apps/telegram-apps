import { describe, vi, expect, it, afterEach } from 'vitest';
import { Utils } from '@/components/Utils/Utils.js';
import { createWindow } from '@test-utils/createWindow.js';

function emptyUtils() {
  return new Utils('', () => '', () => null);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('openTelegramLink', () => {
  it('should throw an error, if hostname is not t.me', () => {
    expect(() => emptyUtils().openTelegramLink('https://ya.ru')).toThrow(
      `URL has not allowed hostname: ya.ru. Only "t.me" is allowed`,
    );

    expect(() => emptyUtils().openTelegramLink('https://ya.ru/abc')).toThrow(
      `URL has not allowed hostname: ya.ru. Only "t.me" is allowed`,
    );
  });

  it('should change window.location.href, if web_app_open_tg_link is not supported', () => {
    createWindow({
      location: {
        href: '',
      },
    } as any);
    const utils = new Utils('6.0', () => '', () => null);

    utils.openTelegramLink('https://t.me/share/url?url=text');
    expect(window.location.href).toBe('https://t.me/share/url?url=text');
  });

  it(
    'should call web_app_open_tg_link with { path_full: string }, where path_full is a combination of pathname and search',
    () => {
      const postEvent = vi.fn();
      const utils = new Utils('7.0', () => '', postEvent);

      utils.openTelegramLink('https://t.me/share/url?url=text');
      expect(postEvent).toHaveBeenCalledOnce();
      expect(postEvent).toHaveBeenCalledWith('web_app_open_tg_link', {
        path_full: '/share/url?url=text',
      });
    },
  );
});

describe('shareURL', () => {
  it('should change window.location.href, if web_app_open_tg_link is not supported', () => {
    createWindow({
      location: {
        href: '',
      },
    } as any);
    const utils = new Utils('6.0', () => '', () => null);

    utils.shareURL('https://telegram.org');
    expect(window.location.href).toBe('https://t.me/share/url?url=https%3A%2F%2Ftelegram.org&text=');

    utils.shareURL('https://telegram.org', 'Wow, cool messenger');
    expect(window.location.href)
      .toBe('https://t.me/share/url?url=https%3A%2F%2Ftelegram.org&text=Wow%2C%20cool%20messenger');
  });

  it(
    'should call web_app_open_tg_link with { path_full: string }, where path_full equals "share/url?url={url}&text={text}"',
    () => {
      const postEvent = vi.fn();
      const utils = new Utils('7.0', () => '', postEvent);

      utils.shareURL('https://telegram.org');
      expect(postEvent).toHaveBeenCalledOnce();
      expect(postEvent).toHaveBeenCalledWith('web_app_open_tg_link', {
        path_full: '/share/url?url=https%3A%2F%2Ftelegram.org&text=',
      });

      postEvent.mockClear();
      utils.shareURL('https://telegram.org', 'Wow, cool messenger');
      expect(postEvent).toHaveBeenCalledOnce();
      expect(postEvent).toHaveBeenCalledWith('web_app_open_tg_link', {
        path_full: '/share/url?url=https%3A%2F%2Ftelegram.org&text=Wow%2C%20cool%20messenger',
      });
    },
  );
});