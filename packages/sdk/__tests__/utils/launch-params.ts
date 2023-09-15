import { retrieveLaunchParams, parseLaunchParams } from '../../src/index.js';

describe('utils', () => {
  describe('launch-params.ts', () => {
    describe('parseLaunchParams', () => {
      it('should correctly parse launch parameters presented as string', () => {
        expect(parseLaunchParams('tgWebAppData=query_id%3DAAHdF6IQAAAAAN0XohAOqR8k%26user%3D%257B%2522id%2522%253A279058397%252C%2522first_name%2522%253A%2522Vladislav%2522%252C%2522last_name%2522%253A%2522Kibenko%2522%252C%2522username%2522%253A%2522vdkfrost%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522is_premium%2522%253Atrue%252C%2522allows_write_to_pm%2522%253Atrue%257D%26auth_date%3D1691441944%26hash%3Da867b5c7c9944dee3890edffd8cd89244eeec7a3d145f1681&tgWebAppVersion=6.7&tgWebAppPlatform=tdesktop&tgWebAppBotInline=1&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%2317212b%22%2C%22button_color%22%3A%22%235288c1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23708499%22%2C%22link_color%22%3A%22%236ab3f3%22%2C%22secondary_bg_color%22%3A%22%23232e3c%22%2C%22text_color%22%3A%22%23f5f5f5%22%7D')).toStrictEqual({
          version: '6.7',
          initData: {
            queryId: 'AAHdF6IQAAAAAN0XohAOqR8k',
            authDate: new Date(1691441944000),
            hash: 'a867b5c7c9944dee3890edffd8cd89244eeec7a3d145f1681',
            user: {
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
      });

      it('should correctly parse launch parameters presented as URLSearchParams', () => {
        const params = new URLSearchParams();

        params.set('tgWebAppData', 'query_id=AAHdF6IQAAAAAN0XohAOqR8k&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1691441944&hash=a867b5c7c9944dee3890edffd8cd89244eeec7a3d145f1681');
        params.set('tgWebAppPlatform', 'tdesktop');
        params.set('tgWebAppThemeParams', '{"bg_color":"#17212b","button_color":"#5288c1","button_text_color":"#ffffff","hint_color":"#708499","link_color":"#6ab3f3","secondary_bg_color":"#232e3c","text_color":"#f5f5f5"}');
        params.set('tgWebAppVersion', '6.7');

        expect(parseLaunchParams(params)).toStrictEqual({
          version: '6.7',
          initData: {
            queryId: 'AAHdF6IQAAAAAN0XohAOqR8k',
            authDate: new Date(1691441944000),
            hash: 'a867b5c7c9944dee3890edffd8cd89244eeec7a3d145f1681',
            user: {
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
      });
    });

    describe('retrieveLaunchParams', () => {
      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should extract launch parameters from window.location.hash and save them in sessionStorage by key "telegram-web-apps-launch-params"', () => {
        const version = '9.1';
        const platform = 'unbelievable';
        const initData = new URLSearchParams({
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
        }).toString();
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
          tgWebAppData: initData,
        }).toString();

        const setItem = jest.fn();
        jest.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => ({
          setItem,
        }) as any);
        jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
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
          initDataRaw: initData,
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
        expect(setItem).toHaveBeenCalledWith('telegram-web-apps-launch-params', JSON.stringify(launchParams));
      });

      it('should returns launch parameters from sessionStorage key "telegram-web-apps-launch-params" in case they are missing in window.location.hash', () => {
        const version = '9.1';
        const platform = 'unbelievable';
        const initData = new URLSearchParams({
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
        }).toString();
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
          tgWebAppData: initData,
        }).toString();

        const getItem = jest.fn(() => JSON.stringify(launchParams));
        jest.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => ({
          getItem,
        }) as any);
        jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
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
          initDataRaw: initData,
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
        expect(getItem).toHaveBeenCalledWith('telegram-web-apps-launch-params');
      });
    });
  });
});
