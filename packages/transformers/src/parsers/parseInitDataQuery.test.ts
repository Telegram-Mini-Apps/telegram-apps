import { expect, it } from 'vitest';

import { parseInitDataQuery } from '@/parsers/parseInitDataQuery.js';

it('should properly create object from query', () => {
  const input = 'user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=-9019086117643313246&chat_type=sender&auth_date=1736362318&signature=JUPYm_qmf8hJYSux535eNDg_a5ZdcOkS6yZMkEUGS09zcXoIopCn3DOuNCa5aWH0PQGaUGGMAaq9MeaMg-6EBg&hash=14cd9c9eeebf82370b20f4df23af9439d00f6da2837dd20e17ed3b03ab99cd9c&additional_prop=1';
  const output = {
    auth_date: new Date(1736362318000),
    chat_instance: '-9019086117643313246',
    chat_type: 'sender',
    hash: '14cd9c9eeebf82370b20f4df23af9439d00f6da2837dd20e17ed3b03ab99cd9c',
    signature: 'JUPYm_qmf8hJYSux535eNDg_a5ZdcOkS6yZMkEUGS09zcXoIopCn3DOuNCa5aWH0PQGaUGGMAaq9MeaMg-6EBg',
    user: {
      allows_write_to_pm: true,
      first_name: 'Vladislav',
      id: 279058397,
      is_premium: true,
      language_code: 'ru',
      last_name: 'Kibenko',
      photo_url: 'https://t.me/i/userpic/320/4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg',
      username: 'vdkfrost',
    },
    additional_prop: '1',
  };

  expect(parseInitDataQuery(input)).toStrictEqual(output);
  expect(parseInitDataQuery(input, false)).toStrictEqual(output);
});

it('should deeply camelize output if true is passed', () => {
  expect(
    parseInitDataQuery('user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=-9019086117643313246&chat_type=sender&auth_date=1736362318&signature=JUPYm_qmf8hJYSux535eNDg_a5ZdcOkS6yZMkEUGS09zcXoIopCn3DOuNCa5aWH0PQGaUGGMAaq9MeaMg-6EBg&hash=14cd9c9eeebf82370b20f4df23af9439d00f6da2837dd20e17ed3b03ab99cd9c&additional_prop=1', true),
  ).toStrictEqual({
    authDate: new Date(1736362318000),
    chatInstance: '-9019086117643313246',
    chatType: 'sender',
    hash: '14cd9c9eeebf82370b20f4df23af9439d00f6da2837dd20e17ed3b03ab99cd9c',
    signature: 'JUPYm_qmf8hJYSux535eNDg_a5ZdcOkS6yZMkEUGS09zcXoIopCn3DOuNCa5aWH0PQGaUGGMAaq9MeaMg-6EBg',
    user: {
      allowsWriteToPm: true,
      firstName: 'Vladislav',
      id: 279058397,
      isPremium: true,
      languageCode: 'ru',
      lastName: 'Kibenko',
      photoUrl: 'https://t.me/i/userpic/320/4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg',
      username: 'vdkfrost',
    },
    additionalProp: '1',
  });
});