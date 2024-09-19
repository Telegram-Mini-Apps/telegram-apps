import { it, expect, afterEach, vi } from 'vitest';
import { createWindow, mockSessionStorageSetItem, mockWindow } from 'test-utils';
import type { LaunchParams } from '@telegram-apps/types';

import { mockTelegramEnv } from './mockTelegramEnv.js';
import { postEvent } from '@/methods/postEvent.js';
import { on } from '@/events/listening/on.js';
import { resetPackageState } from '@/resetPackageState.js';

afterEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
});

const lp: LaunchParams = {
  themeParams: {
    accentTextColor: '#6ab2f2',
    bgColor: '#17212b',
    buttonColor: '#5288c1',
    buttonTextColor: '#ffffff',
    destructiveTextColor: '#ec3942',
    headerBgColor: '#17212b',
    hintColor: '#708499',
    linkColor: '#6ab3f3',
    secondaryBgColor: '#232e3c',
    sectionBgColor: '#17212b',
    sectionHeaderTextColor: '#6ab3f3',
    subtitleTextColor: '#708499',
    textColor: '#f5f5f5',
  },
  initData: {
    authDate: new Date(1716922846000),
    chatInstance: '8428209589180549439',
    chatType: 'sender',
    hash: '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31',
    startParam: 'debug',
    user: {
      allowsWriteToPm: true,
      firstName: 'Andrew',
      id: 99281932,
      isPremium: true,
      languageCode: 'en',
      lastName: 'Rogue',
      username: 'rogue',
    },
  },
  initDataRaw: 'user=%7B%22id%22%3A99281932%2C%22first_name%22%3A%22Andrew%22%2C%22last_name%22%3A%22Rogue%22%2C%22username%22%3A%22rogue%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8428209589180549439&chat_type=sender&start_param=debug&auth_date=1716922846&hash=89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31',
  version: '7.2',
  platform: 'tdesktop',
  botInline: false,
  showSettings: false
};

const lpString = 'tgWebAppPlatform=tdesktop&tgWebAppThemeParams=%7B%22accent_text_color%22%3A%22%236ab2f2%22%2C%22bg_color%22%3A%22%2317212b%22%2C%22button_color%22%3A%22%235288c1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22destructive_text_color%22%3A%22%23ec3942%22%2C%22header_bg_color%22%3A%22%2317212b%22%2C%22hint_color%22%3A%22%23708499%22%2C%22link_color%22%3A%22%236ab3f3%22%2C%22secondary_bg_color%22%3A%22%23232e3c%22%2C%22section_bg_color%22%3A%22%2317212b%22%2C%22section_header_text_color%22%3A%22%236ab3f3%22%2C%22subtitle_text_color%22%3A%22%23708499%22%2C%22text_color%22%3A%22%23f5f5f5%22%7D&tgWebAppVersion=7.2&tgWebAppData=user%3D%257B%2522id%2522%253A99281932%252C%2522first_name%2522%253A%2522Andrew%2522%252C%2522last_name%2522%253A%2522Rogue%2522%252C%2522username%2522%253A%2522rogue%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522is_premium%2522%253Atrue%252C%2522allows_write_to_pm%2522%253Atrue%257D%26chat_instance%3D8428209589180549439%26chat_type%3Dsender%26start_param%3Ddebug%26auth_date%3D1716922846%26hash%3D89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31&tgWebAppShowSettings=0&tgWebAppBotInline=0';

it('should save passed launch parameters in session storage', () => {
  const setItem = mockSessionStorageSetItem();
  mockWindow({} as any);

  mockTelegramEnv(lp);
  expect(setItem).toHaveBeenCalledOnce();
  expect(setItem).toHaveBeenCalledWith(expect.anything(), JSON.stringify(lpString));

  setItem.mockClear();

  mockTelegramEnv(lpString);
  expect(setItem).toHaveBeenCalledOnce();
  expect(setItem).toHaveBeenCalledWith(expect.anything(), JSON.stringify(lpString));
});

it('should emit "theme_changed" event for "web_app_request_theme" method using window.parent.postMessage', () => {
  createWindow({
    parent: { postMessage:  vi.fn() } as any,
    env: 'iframe',
  });
  mockTelegramEnv(lp);

  const listener = vi.fn();
  on('theme_changed', listener);

  postEvent('web_app_request_theme');
  expect(listener).toHaveBeenCalledOnce();
  expect(listener).toHaveBeenCalledWith({
    theme_params: {
      accent_text_color: '#6ab2f2',
      bg_color: '#17212b',
      button_color: '#5288c1',
      button_text_color: '#ffffff',
      destructive_text_color: '#ec3942',
      header_bg_color: '#17212b',
      hint_color: '#708499',
      link_color: '#6ab3f3',
      secondary_bg_color: '#232e3c',
      section_bg_color: '#17212b',
      section_header_text_color: '#6ab3f3',
      subtitle_text_color: '#708499',
      text_color: '#f5f5f5',
    },
  }, undefined);
});

it('should emit "viewport_changed" event for "web_app_request_viewport" method using window.parent.postMessage', () => {
  const postMessage = vi.fn();
  createWindow({
    parent: { postMessage } as any,
    innerWidth: 1000,
    innerHeight: 2000,
    env: 'iframe',
  });
  mockTelegramEnv(lp);

  const listener = vi.fn();
  on('viewport_changed', listener);

  postEvent('web_app_request_viewport');
  expect(listener).toHaveBeenCalledOnce();
  expect(listener).toHaveBeenCalledWith({
    width: 1000,
    height: 2000,
    is_state_stable: true,
    is_expanded: true,
  }, undefined);
});

it('should wire window.TelegramWebviewProxy.postEvent', () => {
  const wiredPostEvent = vi.fn();
  createWindow({ TelegramWebviewProxy: { postEvent: wiredPostEvent } } as any);
  mockTelegramEnv(lp);

  postEvent('web_app_expand');
  expect(wiredPostEvent).toHaveBeenCalledOnce();
  expect(wiredPostEvent).toHaveBeenCalledWith('web_app_expand', undefined);
});
