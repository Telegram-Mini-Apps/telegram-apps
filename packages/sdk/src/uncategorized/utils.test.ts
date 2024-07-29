import { describe, vi, expect, it, afterEach, beforeEach } from 'vitest';
import { createWindow } from '@test-utils/createWindow.js';

import { postEvent, version } from '@/components/globals.js';
import { postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';
import { resetMiniAppsEventEmitter } from '@/bridge/events/event-emitter/singleton.js';

import {
  shareURL,
  openTelegramLink,
  openLink,
  readTextFromClipboard,
} from './utils.js';

beforeEach(() => {
  postEvent.set(() => null);
  resetMiniAppsEventEmitter();
  vi.restoreAllMocks();
})

afterEach(() => {
  // Reset postEvent.
  postEvent.set(defaultPostEvent);
  version.set(() => null);
});

describe('openTelegramLink', () => {
  it('should throw an error, if hostname is not t.me', () => {
    expect(() => openTelegramLink('https://ya.ru')).toThrow(`ERR_INVALID_HOSTNAME`);
    expect(() => openTelegramLink('https://ya.ru/abc')).toThrow(`ERR_INVALID_HOSTNAME`);
  });

  it('should change window.location.href, if web_app_open_tg_link is not supported', () => {
    createWindow({ location: { href: '' } } as any);
    openTelegramLink('https://t.me/share/url?url=text');
    expect(window.location.href).toBe('https://t.me/share/url?url=text');
  });

  it('should call web_app_open_tg_link with { path_full: string }, where path_full is a combination of pathname and search', () => {
    const spy = vi.fn();
    postEvent.set(spy);
    version.set('10');
    openTelegramLink('https://t.me/share/url?url=text');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_open_tg_link', {
      path_full: '/share/url?url=text',
    });
  });
});

describe('shareURL', () => {
  it('should change window.location.href, if web_app_open_tg_link is not supported', () => {
    createWindow({ location: { href: '' } } as any);

    shareURL('https://telegram.org');
    expect(window.location.href).toBe('https://t.me/share/url?url=https%3A%2F%2Ftelegram.org&text=');

    shareURL('https://telegram.org', 'Wow, cool messenger');
    expect(window.location.href).toBe(
      'https://t.me/share/url?url=https%3A%2F%2Ftelegram.org&text=Wow%2C%20cool%20messenger',
    );
  });

  it('should call web_app_open_tg_link with { path_full: string }, where path_full equals "share/url?url={url}&text={text}"', () => {
    const spy = vi.fn();
    postEvent.set(spy);

    shareURL('https://telegram.org');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_open_tg_link', {
      path_full: '/share/url?url=https%3A%2F%2Ftelegram.org&text=',
    });

    spy.mockClear();
    shareURL('https://telegram.org', 'Wow, cool messenger');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_open_tg_link', {
      path_full: '/share/url?url=https%3A%2F%2Ftelegram.org&text=Wow%2C%20cool%20messenger',
    });
  });
});