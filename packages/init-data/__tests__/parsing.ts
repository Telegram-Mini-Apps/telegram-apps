import { test, expect } from 'vitest';

import { initData } from '../src/index.js';

test('parsing', () => {
  test('initData', () => {
    test('should throw an error in case, passed value does not match required schema', () => {
      expect(() => initData.parse('hash=someHash')).toThrow();
    });

    test('should return result in case, passed value matches schema', () => {
      const initDataString = 'auth_date=1672418130&hash=68570a4968ca87b8bde6fae0e6a2e30486af899bf80982105d16dc42fe89b45d&query_id=AAHdF6IQAAAAAN0XohASX1Fh&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D';
      expect(initData.parse(initDataString)).toStrictEqual({
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
      });
    });
  });
});
