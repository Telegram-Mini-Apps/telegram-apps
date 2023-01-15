import {JsonShape, SearchParamsShape} from '../src';

const lp = 'tgWebAppData=auth_date%3D1672418130%26hash%3D68570a4968ca87b8bde6fae0e6a2e30486af899bf80982105d16dc42fe89b45d%26query_id%3DAAHdF6IQAAAAAN0XohASX1Fh%26user%3D%257B%2522id%2522%253A279058397%252C%2522first_name%2522%253A%2522Vladislav%2522%252C%2522last_name%2522%253A%2522Kibenko%2522%252C%2522username%2522%253A%2522vdkfrost%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522is_premium%2522%253Atrue%257D&tgWebAppPlatform=tdesktop&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%2317212b%22%2C%22button_color%22%3A%22%235288c1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23708499%22%2C%22link_color%22%3A%22%236ab3f3%22%2C%22secondary_bg_color%22%3A%22%23232e3c%22%2C%22text_color%22%3A%22%23f5f5f5%22%7D&tgWebAppVersion=6.4';

const user = new JsonShape()
  .string('first_name', 'firstName')
  .number('id')
  .bool('is_bot', 'isBot', true)
  .bool('is_premium', 'isPremium', true)
  .string('last_name', 'lastName', true)
  .string('language_code', 'languageCode', true)
  .string('photo_url', 'photoURL', true)
  .string('username', true);

const chat = new JsonShape()
  .number('id')
  .string('photo_url', 'photoURL', true)
  .string('type')
  .string('title')
  .string('username', true);

const launchParams = new SearchParamsShape()
  .string('tgWebAppVersion')
  .string('tgWebAppPlatform')
  .custom('tgWebAppData', new SearchParamsShape()
    .date('auth_date')
    .string('hash')
    .custom('user', user, true)
    .custom('receiver', user, true)
    .custom('chat', chat, true)
    .date('can_send_after', true)
    .string('query_id', true)
    .string('start_param', true),
  )
  .custom('tgWebAppThemeParams', new JsonShape()
    .rgb('bg_color', 'backgroundColor')
    .rgb('hint_color', 'hintColor')
    .rgb('text_color', 'textColor')
    .rgb('button_color', 'buttonColor')
    .rgb('button_text_color', 'buttonTextColor')
    .rgb('link_color', 'linkColor')
    .rgb('secondary_bg_color', 'secondaryBackgroundColor', true),
  );

const parsed = launchParams.parse(lp);
console.log(parsed);