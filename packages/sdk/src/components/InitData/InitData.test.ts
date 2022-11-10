import {describe, expect, it} from '@jest/globals';
import {InitData} from './InitData';

describe('components', () => {
  describe('InitData', () => {
    describe('fromSearchParams', () => {
      it('should correctly parse search params', () => {
        expect(InitData.fromSearchParams('query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2'))
          .toStrictEqual(
            new InitData(
              new Date('2022-09-10T01:00:48.000Z'),
              'c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2',
              {
                queryId: 'AAHdF6IQAAAAAN0XohDhrOrc',
                user: {
                  id: 279058397,
                  firstName: 'Vladislav',
                  lastName: 'Kibenko',
                  username: 'vdkfrost',
                  languageCode: 'ru',
                  isPremium: true,
                },
              })
          );
      });
    });
  });
});