# @telegram-apps/transformers

[code-badge]: https://img.shields.io/badge/source-black?logo=github

[docs-badge]: https://img.shields.io/badge/documentation-blue?logo=gitbook&logoColor=white

[link]: https://github.com/Telegram-Mini-Apps/telegram-apps/tree/master/packages/transformers

[docs-link]: https://docs.telegram-mini-apps.com/packages/telegram-apps-transformers

[npm-link]: https://npmjs.com/package/@telegram-apps/transformers

[npm-badge]: https://img.shields.io/npm/v/@telegram-apps/transformers?logo=npm

[size-badge]: https://img.shields.io/bundlephobia/minzip/@telegram-apps/transformers

[![NPM][npm-badge]][npm-link]
![Size][size-badge]
[![docs-badge]][docs-link]
[![code-badge]][link]

The package that provides [valibot](https://www.npmjs.com/package/valibot) schemas and related
utilities to work with the `@telegram-apps/types` typings.

## Schemas' Generators

Schemas' generators are functions accepting `true`, if the output must be deeply camel-cased.

The schema generator's name ends with the `Query` suffix if it creates a valibot schema accepting
query parameters presented as a string or an instance of `URLSearchParams`. It also may end with
the `Json` suffix accepting a JSON object presented as a string.

### `initDataQuery`

The `initDataQuery` generator returns a new schema
for [init data](https://docs.telegram-mini-apps.com/platform/init-data).

```ts
import { initDataQuery } from '@telegram-apps/transformers';
import { create, is } from 'valibot';

const initData = 'user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=-9019086117643313246&chat_type=sender&auth_date=1736362318&signature=JUPYm_qmf8hJYSux535eNDg_a5ZdcOkS6yZMkEUGS09zcXoIopCn3DOuNCa5aWH0PQGaUGGMAaq9MeaMg-6EBg&hash=14cd9c9eeebf82370b20f4df23af9439d00f6da2837dd20e17ed3b03ab99cd9c&additional_prop=1';

console.log(is(initDataQuery(), initData));
// Output: true

console.log(create(initDataQuery(), initData));
// Output:
// {
//   auth_date: new Date(1736362318000),
//   chat_instance: '-9019086117643313246',
//   chat_type: 'sender',
//   hash: '14cd9c9eeebf82370b20f4df23af9439d00f6da2837dd20e17ed3b03ab99cd9c',
//   signature: 'JUPYm_qmf8hJYSux535eNDg_a5ZdcOkS6yZMkEUGS09zcXoIopCn3DOuNCa5aWH0PQGaUGGMAaq9MeaMg-6EBg',
//   user: {
//     allows_write_to_pm: true,
//     first_name: 'Vladislav',
//     id: 279058397,
//     is_premium: true,
//     language_code: 'ru',
//     last_name: 'Kibenko',
//     photo_url: 'https://t.me/i/userpic/320/4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg',
//     username: 'vdkfrost',
//   },
//   additional_prop: '1',
// };

console.log(create(initDataQuery(true), initData));
// Output will be camelized:
// {
//   authDate: new Date(1736362318000),
//   chatInstance: '-9019086117643313246',
//   chatType: 'sender',
//   hash: '14cd9c9eeebf82370b20f4df23af9439d00f6da2837dd20e17ed3b03ab99cd9c',
//   signature: 'JUPYm_qmf8hJYSux535eNDg_a5ZdcOkS6yZMkEUGS09zcXoIopCn3DOuNCa5aWH0PQGaUGGMAaq9MeaMg-6EBg',
//   user: {
//     allowsWriteToPm: true,
//     firstName: 'Vladislav',
//     id: 279058397,
//     isPremium: true,
//     languageCode: 'ru',
//     lastName: 'Kibenko',
//     photoUrl: 'https://t.me/i/userpic/320/4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg',
//     username: 'vdkfrost',
//   },
//   additionalProp: '1',
// };
```

### `launchParamsQuery`

The `initDataQuery` generator returns a new schema
for [launch parameters](https://docs.telegram-mini-apps.com/platform/launch-parameters).

```ts
import { launchParamsQuery } from '@telegram-apps/transformers';
import { create, is } from 'valibot';

const launchParams = 'tgWebAppData=user%3D%257B%2522id%2522%253A279058397%252C%2522first_name%2522%253A%2522Vladislav%2522%252C%2522last_name%2522%253A%2522Kibenko%2522%252C%2522username%2522%253A%2522vdkfrost%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522is_premium%2522%253Atrue%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%2522%257D%26chat_instance%3D-9019086117643313246%26chat_type%3Dsender%26auth_date%3D1736409902%26signature%3DFNWSy6kv5n4kkmYYmfTbrgRtswTvwXgHTRWBVjp-YOv2srtMFSYCWZ9nGr_PohWZeWcooFo_oQgsnTJge3JdBA%26hash%3D4c710b1d446dd4fd301c0efbf7c31627eca193a2e657754c9e0612cb1eb71d90&tgWebAppVersion=8.0&tgWebAppPlatform=tdesktop&tgWebAppThemeParams=%7B%22accent_text_color%22%3A%22%236ab3f2%22%2C%22bg_color%22%3A%22%2317212b%22%2C%22bottom_bar_bg_color%22%3A%22%2317212b%22%2C%22button_color%22%3A%22%235289c1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22destructive_text_color%22%3A%22%23ec3942%22%2C%22header_bg_color%22%3A%22%2317212b%22%2C%22hint_color%22%3A%22%23708599%22%2C%22link_color%22%3A%22%236ab3f3%22%2C%22secondary_bg_color%22%3A%22%23232e3c%22%2C%22section_bg_color%22%3A%22%2317212b%22%2C%22section_header_text_color%22%3A%22%236ab3f3%22%2C%22section_separator_color%22%3A%22%23111921%22%2C%22subtitle_text_color%22%3A%22%23708599%22%2C%22text_color%22%3A%22%23f5f5f5%22%7D';

console.log(is(launchParamsQuery(), launchParams));
// Output: true

console.log(create(launchParamsQuery(), launchParams));
// Output:
// {
//   tgWebAppData: {
//     auth_date: new Date(1736409902000),
//     chat_instance: '-9019086117643313246',
//     chat_type: 'sender',
//     hash: '4c710b1d446dd4fd301c0efbf7c31627eca193a2e657754c9e0612cb1eb71d90',
//     signature: 'FNWSy6kv5n4kkmYYmfTbrgRtswTvwXgHTRWBVjp-YOv2srtMFSYCWZ9nGr_PohWZeWcooFo_oQgsnTJge3JdBA',
//     user: {
//       allows_write_to_pm: true,
//       first_name: 'Vladislav',
//       id: 279058397,
//       is_premium: true,
//       language_code: 'ru',
//       last_name: 'Kibenko',
//       photo_url: 'https://t.me/i/userpic/320/4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg',
//       username: 'vdkfrost',
//     },
//   },
//   tgWebAppPlatform: 'tdesktop',
//   tgWebAppThemeParams: {
//     accent_text_color: '#6ab3f2',
//     bg_color: '#17212b',
//     bottom_bar_bg_color: '#17212b',
//     button_color: '#5289c1',
//     button_text_color: '#ffffff',
//     destructive_text_color: '#ec3942',
//     header_bg_color: '#17212b',
//     hint_color: '#708599',
//     link_color: '#6ab3f3',
//     secondary_bg_color: '#232e3c',
//     section_bg_color: '#17212b',
//     section_header_text_color: '#6ab3f3',
//     section_separator_color: '#111921',
//     subtitle_text_color: '#708599',
//     text_color: '#f5f5f5',
//   },
//   tgWebAppVersion: '8.0',
// }

console.log(create(launchParamsQuery(true), launchParams));
// Output will be camelized:
// {
//   tgWebAppData: {
//     authDate: new Date(1736409902000),
//     chatInstance: '-9019086117643313246',
//     chatType: 'sender',
//     hash: '4c710b1d446dd4fd301c0efbf7c31627eca193a2e657754c9e0612cb1eb71d90',
//     signature: 'FNWSy6kv5n4kkmYYmfTbrgRtswTvwXgHTRWBVjp-YOv2srtMFSYCWZ9nGr_PohWZeWcooFo_oQgsnTJge3JdBA',
//     user: {
//       allowsWriteToPm: true,
//       firstName: 'Vladislav',
//       id: 279058397,
//       isPremium: true,
//       languageCode: 'ru',
//       lastName: 'Kibenko',
//       photoUrl: 'https://t.me/i/userpic/320/4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg',
//       username: 'vdkfrost',
//     },
//   },
//   tgWebAppPlatform: 'tdesktop',
//   tgWebAppThemeParams: {
//     accentTextColor: '#6ab3f2',
//     bgColor: '#17212b',
//     bottomBarBgColor: '#17212b',
//     buttonColor: '#5289c1',
//     buttonTextColor: '#ffffff',
//     destructiveTextColor: '#ec3942',
//     headerBgColor: '#17212b',
//     hintColor: '#708599',
//     linkColor: '#6ab3f3',
//     secondaryBgColor: '#232e3c',
//     sectionBgColor: '#17212b',
//     sectionHeaderTextColor: '#6ab3f3',
//     sectionSeparatorColor: '#111921',
//     subtitleTextColor: '#708599',
//     textColor: '#f5f5f5',
//   },
//   tgWebAppVersion: '8.0',
// }
```