import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem, mockSessionStorageSetItem, toSearchParams } from 'test-utils';

import { retrieveFromStorage, saveToStorage } from '../src/index.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('retrieveFromStorage', () => {
  it('should use key "telegram-mini-apps-launch-params" to extract data from', () => {
    const getItemSpy = vi.fn(() => '');
    mockSessionStorageGetItem(getItemSpy);

    retrieveFromStorage();

    expect(getItemSpy).toHaveBeenCalledOnce();
    expect(getItemSpy).toHaveBeenCalledWith('telegram-mini-apps-launch-params');
  });

  it('should return launch params in case, session storage contains value by key "telegram-mini-apps-launch-params"', () => {
    const getItemSpy = mockSessionStorageGetItem('tgWebAppData=query_id%3DAAHdF6IQAAAAAN0XohAOqR8k%26user%3D%257B%2522id%2522%253A279058397%252C%2522first_name%2522%253A%2522Vladislav%2522%252C%2522last_name%2522%253A%2522Kibenko%2522%252C%2522username%2522%253A%2522vdkfrost%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522is_premium%2522%253Atrue%252C%2522allows_write_to_pm%2522%253Atrue%257D%26auth_date%3D1691441944%26hash%3Da867b5c7c9944dee3890edffd8cd89244eeec7a3d145f1681&tgWebAppVersion=6.7&tgWebAppPlatform=tdesktop&tgWebAppBotInline=1&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%2317212b%22%2C%22button_color%22%3A%22%235288c1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23708499%22%2C%22link_color%22%3A%22%236ab3f3%22%2C%22secondary_bg_color%22%3A%22%23232e3c%22%2C%22text_color%22%3A%22%23f5f5f5%22%7D');

    expect(retrieveFromStorage()).toStrictEqual({
      botInline: true,
      version: '6.7',
      initData: {
        queryId: 'AAHdF6IQAAAAAN0XohAOqR8k',
        authDate: new Date(1691441944000),
        hash: 'a867b5c7c9944dee3890edffd8cd89244eeec7a3d145f1681',
        user: {
          allowsWriteToPm: true,
          id: 279058397,
          firstName: 'Vladislav',
          lastName: 'Kibenko',
          username: 'vdkfrost',
          languageCode: 'ru',
          isPremium: true,
        },
      },
      initDataRaw: 'query_id=AAHdF6IQAAAAAN0XohAOqR8k&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1691441944&hash=a867b5c7c9944dee3890edffd8cd89244eeec7a3d145f1681',
      platform: 'tdesktop',
      themeParams: {
        backgroundColor: '#17212b',
        buttonColor: '#5288c1',
        buttonTextColor: '#ffffff',
        hintColor: '#708499',
        linkColor: '#6ab3f3',
        secondaryBackgroundColor: '#232e3c',
        textColor: '#f5f5f5',
      },
    });

    expect(getItemSpy).toHaveBeenCalledOnce();
    expect(getItemSpy).toHaveBeenCalledWith('telegram-mini-apps-launch-params');
  });

  it('should throw in case, session storage contains invalid value by key "telegram-mini-apps-launch-params"', () => {
    const getItemSpy = mockSessionStorageGetItem('abc');

    expect(() => retrieveFromStorage()).toThrow();
    expect(getItemSpy).toHaveBeenCalledOnce();
    expect(getItemSpy).toHaveBeenCalledWith('telegram-mini-apps-launch-params');
  });
});

describe('saveToStorage', () => {
  it('should use key "telegram-mini-apps-launch-params" to save in the session storage', () => {
    const setItemSpy = mockSessionStorageSetItem();

    saveToStorage({
      version: '6.10',
      platform: 'macos',
      themeParams: {},
    });

    expect(setItemSpy).toHaveBeenCalledWith('telegram-mini-apps-launch-params', expect.anything());
  });

  it('should convert launch params to search parameters in the order: tgWebAppData, tgWebAppPlatform, tgWebAppThemeParams, tgWebAppVersion, tgWebAppShowSettings, tgWebAppBotInline', () => {
    const setItemSpy = mockSessionStorageSetItem();

    saveToStorage({
      version: '6.3',
      platform: 'web',
      botInline: false,
      showSettings: false,
      initDataRaw: toSearchParams({
        auth_date: 13,
        hash: 'abc123',
      }),
      themeParams: {
        backgroundColor: '#aabbcc',
      },
    });

    expect(setItemSpy).toHaveBeenLastCalledWith(
      expect.anything(),
      'tgWebAppData=auth_date%3D13%26hash%3Dabc123&tgWebAppPlatform=web&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23aabbcc%22%7D&tgWebAppVersion=6.3&tgWebAppShowSettings=0&tgWebAppBotInline=0',
    );
  });
});
