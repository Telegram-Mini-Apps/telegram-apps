import {describe, expect, it} from '@jest/globals';
import {extractThemeFromJson, extractThemeFromLocation} from '../utils';

describe('utils', () => {
  describe('extractThemeFromLocation', () => {
    it(
      'should throw an error in case, window location hash does not ' +
      'contain tgWebAppThemeParams parameter', () => {
        window.location.hash = '#tgWebAppData=query_id%3DAAHdF6IQAAAAAN0XohChJGOt%26user%3D%257B%2522id%2522%253A279058397%252C%2522first_name%2522%253A%2522Vladislav%2522%252C%2522last_name%2522%253A%2522Kibenko%2522%252C%2522username%2522%253A%2522vdkfrost%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522is_premium%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%2522%257D%26receiver%3D%257B%2522id%2522%253A1985737506%252C%2522is_bot%2522%253Atrue%252C%2522first_name%2522%253A%2522Wallet%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522wallet%2522%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FfySBGKdwVHbIbghGmjAUcMU5KdJhE4ub_Hr51uOE5pE.svg%2522%257D%26auth_date%3D1667535190%26hash%3D6e9439dc0270cdf9a7f1d716b5980d0cd9a618afe20340b0eee2d7bb3063a35b&tgWebAppVersion=6.2&tgWebAppPlatform=web';

        expect(() => extractThemeFromLocation()).toThrowError('Parameter "tgWebAppThemeParams" is missing.');
      },
    );

    it(
      'should return result of extractThemeFromJson function ' +
      'with passed tgWebAppThemeParams search parameter from ' +
      'location hash', () => {
        const themeParams = '%7B%22bg_color%22%3A%22%23212121%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%238774e1%22%2C%22button_color%22%3A%22%238774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22secondary_bg_color%22%3A%22%230f0f0f%22%7D';
        window.location.hash = '#tgWebAppData=query_id%3DAAHdF6IQAAAAAN0XohChJGOt%26user%3D%257B%2522id%2522%253A279058397%252C%2522first_name%2522%253A%2522Vladislav%2522%252C%2522last_name%2522%253A%2522Kibenko%2522%252C%2522username%2522%253A%2522vdkfrost%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522is_premium%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%2522%257D%26receiver%3D%257B%2522id%2522%253A1985737506%252C%2522is_bot%2522%253Atrue%252C%2522first_name%2522%253A%2522Wallet%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522wallet%2522%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FfySBGKdwVHbIbghGmjAUcMU5KdJhE4ub_Hr51uOE5pE.svg%2522%257D%26auth_date%3D1667535190%26hash%3D6e9439dc0270cdf9a7f1d716b5980d0cd9a618afe20340b0eee2d7bb3063a35b&tgWebAppVersion=6.2&tgWebAppPlatform=web&tgWebAppThemeParams=' + themeParams;

        expect(extractThemeFromLocation())
          .toStrictEqual(extractThemeFromJson(decodeURIComponent(themeParams)));
      },
    );
  });
});