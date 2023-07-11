import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { retrieveLaunchParams } from '../../src';

describe('utils', () => {
  describe('launch-params.ts', () => {
    describe('retrieveLaunchParams', () => {
      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should extract launch parameters from window.location.hash '
        + 'and save them in sessionStorage by key "__telegram-launch-params__"', () => {
        const version = '9.1';
        const platform = 'unbelievable';
        const launchParams = new URLSearchParams({
          tgWebAppVersion: version,
          tgWebAppPlatform: platform,
          tgWebAppThemeParams: JSON.stringify({
            bg_color: '#ffaabb',
            button_color: '#233312',
            button_text_color: '#ddaa21',
            hint_color: '#da1122',
            link_color: '#22314a',
            text_color: '#31344a',
          }),
          tgWebAppData: new URLSearchParams({
            hash: '68570a4968ca87b8bde6fae0e6a2e30486af899bf80982105d16dc42fe89b45d',
            auth_date: '1672418130',
            query_id: 'AAHdF6IQAAAAAN0XohASX1Fh',
            user: JSON.stringify({
              id: 279058397,
              first_name: 'Vladislav',
              last_name: 'Kibenko',
              username: 'vdkfrost',
              language_code: 'ru',
              is_premium: true,
            }),
          }).toString(),
        }).toString();

        const setItem = jest.fn();
        jest.spyOn(global, 'sessionStorage', 'get').mockImplementation(() => ({
          setItem,
        }) as any);
        jest.spyOn(global, 'window', 'get').mockImplementation(() => ({
          location: { hash: `#${launchParams}` },
        }) as any);

        expect(retrieveLaunchParams()).toStrictEqual({
          version,
          initData: {
            hash: '68570a4968ca87b8bde6fae0e6a2e30486af899bf80982105d16dc42fe89b45d',
            authDate: new Date(1672418130000),
            queryId: 'AAHdF6IQAAAAAN0XohASX1Fh',
            user: {
              id: 279058397,
              firstName: 'Vladislav',
              lastName: 'Kibenko',
              username: 'vdkfrost',
              languageCode: 'ru',
              isPremium: true,
            },
          },
          platform,
          themeParams: {
            backgroundColor: '#ffaabb',
            buttonColor: '#233312',
            buttonTextColor: '#ddaa21',
            hintColor: '#da1122',
            linkColor: '#22314a',
            textColor: '#31344a',
          },
        });
        expect(setItem).toHaveBeenCalledWith('__telegram-launch-params__', launchParams);
      });

      it('should returns launch parameters from sessionStorage key '
        + '"__telegram-launch-params__" in case they are missing '
        + 'in window.location.hash', () => {
        const version = '9.1';
        const platform = 'unbelievable';
        const launchParams = new URLSearchParams({
          tgWebAppVersion: version,
          tgWebAppPlatform: platform,
          tgWebAppThemeParams: JSON.stringify({
            bg_color: '#ffaabb',
            button_color: '#233312',
            button_text_color: '#ddaa21',
            hint_color: '#da1122',
            link_color: '#22314a',
            text_color: '#31344a',
          }),
          tgWebAppData: new URLSearchParams({
            hash: '68570a4968ca87b8bde6fae0e6a2e30486af899bf80982105d16dc42fe89b45d',
            auth_date: '1672418130',
            query_id: 'AAHdF6IQAAAAAN0XohASX1Fh',
            user: JSON.stringify({
              id: 279058397,
              first_name: 'Vladislav',
              last_name: 'Kibenko',
              username: 'vdkfrost',
              language_code: 'ru',
              is_premium: true,
            }),
          }).toString(),
        }).toString();

        const getItem = jest.fn(() => launchParams);
        jest.spyOn(global, 'sessionStorage', 'get').mockImplementation(() => ({
          getItem,
        }) as any);
        jest.spyOn(global, 'window', 'get').mockImplementation(() => ({
          location: { hash: '' },
        }) as any);

        expect(retrieveLaunchParams()).toStrictEqual({
          version,
          initData: {
            hash: '68570a4968ca87b8bde6fae0e6a2e30486af899bf80982105d16dc42fe89b45d',
            authDate: new Date(1672418130000),
            queryId: 'AAHdF6IQAAAAAN0XohASX1Fh',
            user: {
              id: 279058397,
              firstName: 'Vladislav',
              lastName: 'Kibenko',
              username: 'vdkfrost',
              languageCode: 'ru',
              isPremium: true,
            },
          },
          platform,
          themeParams: {
            backgroundColor: '#ffaabb',
            buttonColor: '#233312',
            buttonTextColor: '#ddaa21',
            hintColor: '#da1122',
            linkColor: '#22314a',
            textColor: '#31344a',
          },
        });
        expect(getItem).toHaveBeenCalledWith('__telegram-launch-params__');
      });
    });
  });
});
