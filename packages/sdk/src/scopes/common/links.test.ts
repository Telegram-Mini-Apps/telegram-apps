import { describe, vi, expect, it, beforeEach } from 'vitest';
import { createWindow } from '@test-utils/createWindow.js';
import { resetGlobals } from '@test-utils/resetGlobals.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';

import { $postEvent, $version } from '@/scopes/globals/globals.js';

import { readTextFromClipboard } from './utils.js';
import { openLink, openTelegramLink, shareURL } from './links.js';

beforeEach(() => {
  resetGlobals();
  $postEvent.set(() => null);
  vi.restoreAllMocks();
});

describe('openLink', () => {
  it('should call "web_app_open_link" with formatted URL and passed options', () => {
    const spy = vi.fn();
    $postEvent.set(spy);
    openLink('https://ya.ru', {
      tryBrowser: 'tor',
      tryInstantView: true,
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_open_link', {
      url: 'https://ya.ru/',
      try_browser: 'tor',
      try_instant_view: true,
    });
  });
});

describe('openTelegramLink', () => {
  it('should throw error, if hostname is not t.me', () => {
    expect(() => openTelegramLink('https://ya.ru')).toThrow(`ERR_INVALID_HOSTNAME`);
    expect(() => openTelegramLink('https://ya.ru/abc')).toThrow(`ERR_INVALID_HOSTNAME`);
  });

  it('should change window.location.href, if "web_app_open_tg_link" is not supported', () => {
    createWindow({ location: { href: '' } } as any);
    openTelegramLink('https://t.me/share/url?url=text');
    expect(window.location.href).toBe('https://t.me/share/url?url=text');
  });

  it('should call "web_app_open_tg_link" with { path_full: string }, where path_full is a combination of pathname and search', () => {
    const spy = vi.fn();
    $postEvent.set(spy);
    $version.set('10');
    openTelegramLink('https://t.me/share/url?url=text');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_open_tg_link', {
      path_full: '/share/url?url=text',
    });
  });
});

describe('readTextFromClipboard', () => {
  it('should call "web_app_read_text_from_clipboard" method and receive "clipboard_text_received" event', async () => {
    const promise = readTextFromClipboard();
    dispatchWindowMessageEvent('clipboard_text_received', {
      req_id: 1,
      data: 'Some text',
    });

    await expect(promise).resolves.toBe('Some text');
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
    $postEvent.set(spy);
    $version.set('10');

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