/* eslint-disable */
import { it, expect, describe } from 'vitest';

import { parse } from '../src/index.js';

// TODO: Complete tests.

describe('parsing.ts', () => {
  describe('parse', () => {
    describe('auth_date', () => {
      it('should throw an error in case property is missing in source', () => {
        expect(() => parse('hash=abc')).toThrow();
      });

      it('should map property from source to "authDate" result property making it a Date by multiplying the source value by 1000', () => {
        expect(parse('hash=abc&auth_date=5')).toMatchObject({
          authDate: new Date(5000),
        });
      });
    });

    describe('hash', () => {
      it('should throw an error in case property is missing in source', () => {
        expect(() => parse('auth_date=1')).toThrow();
      });

      it('should map property from source to "hash" result property as is', () => {
        expect(parse('hash=abc&auth_date=5')).toMatchObject({
          hash: 'abc',
        });
      });
    });

    describe('can_send_after', () => {
      it('should not throw an error in case property is missing', () => {
        expect(() => parse('hash=abc&auth_date=1')).not.toThrow();
      });

      it('should throw an error in case property has value which is not a number presented as string', () => {
        expect(() => parse('hash=abc&auth_date=5&can_send_after=ball')).toThrow();
      });

      it('should map property from source to "canSendAfter" result property converting number presented as string to number', () => {
        expect(parse('hash=abc&auth_date=5&can_send_after=1')).toMatchObject({
          canSendAfter: 1,
        });
      });
    });

    // describe('chat', () => {
    //   it('should not throw an error in case property is missing', () => {
    //     expect(() => parse('hash=abc&auth_date=1')).not.toThrow();
    //   });
    //
    //   describe('id', () => {
    //     it('should throw an error in case property is missing', () => {
    //       expect(() => parse(`hash=abc&auth_date=1&${createChat({ title: '123' })}`)).toThrow();
    //     });
    //
    //     it('should throw an error in case property has value which is not a number presented as string', () => {
    //       expect(() => parse(`hash=abc&auth_date=5&${createChat({
    //         title: '123',
    //         id: 'a',
    //       })}`)).toThrow();
    //     });
    //
    //     it('should map property from source to "chat.id" result property converting number presented as string to number', () => {
    //       console.log(`hash=abc&auth_date=5&${createChat({
    //         id: 1000,
    //         title: 'abc',
    //       })}`);
    //       expect(parse(`hash=abc&auth_date=5&${createChat({
    //         id: 1000,
    //         title: 'abc',
    //       })}`)).toMatchObject({
    //         chat: {
    //           id: 1,
    //         },
    //       });
    //     });
    //   });
    // });

    [
      ['chat_type', 'chatType'],
      ['chat_instance', 'chatInstance'],
      ['query_id', 'queryId'],
      ['start_param', 'startParam'],
    ].forEach(([from, to]) => {
      describe(from, () => {
        it('should not throw an error in case property is missing', () => {
          expect(() => parse('hash=abc&auth_date=1')).not.toThrow();
        });

        it(`should map property from source to "${to}" as is`, () => {
          expect(parse(`hash=abc&auth_date=1&${from}=test`)).toMatchObject({
            [to]: 'test',
          });
        });
      });
    });

    // it('should throw an error in case, passed value does not match required schema', () => {
    //   expect(() => initData.parse('hash=someHash')).toThrow();
    // });
    //
    // it('should return result in case, passed value matches schema', () => {
    //   const initDataString = 'auth_date=1672418130&hash=68570a4968ca87b8bde6fae0e6a2e30486af899bf80982105d16dc42fe89b45d&query_id=AAHdF6IQAAAAAN0XohASX1Fh&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D';
    //   expect(initData.parse(initDataString)).toStrictEqual({
    //     hash: '68570a4968ca87b8bde6fae0e6a2e30486af899bf80982105d16dc42fe89b45d',
    //     authDate: new Date(1672418130000),
    //     queryId: 'AAHdF6IQAAAAAN0XohASX1Fh',
    //     user: {
    //       id: 279058397,
    //       firstName: 'Vladislav',
    //       lastName: 'Kibenko',
    //       username: 'vdkfrost',
    //       languageCode: 'ru',
    //       isPremium: true,
    //     },
    //   });
    // });
  });
});
