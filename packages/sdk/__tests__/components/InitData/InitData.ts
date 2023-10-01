import { expect, test } from 'vitest';

import { InitData } from '../../../src/index.js';

test('components', () => {
  test('InitData', () => {
    test('InitData.ts', () => {
      test('InitData', () => {
       test('should return fields specified in constructor. In case, some properties are missing, they should be equal to null in InitData', () => {
          const authDate = new Date(123);
          const data1 = new InitData(authDate, 'hash');
          expect(data1.authDate).toBe(authDate);
          expect(data1.canSendAfter).toBe(null);
          expect(data1.chat).toBe(null);
          expect(data1.hash).toBe('hash');
          expect(data1.queryId).toBe(null);
          expect(data1.receiver).toBe(null);
          expect(data1.startParam).toBe(null);
          expect(data1.user).toBe(null);

          const canSendAfter = new Date(999);
          const data2 = new InitData(authDate, 'joke', {
            canSendAfter,
            chat: {
              id: 999,
              photoUrl: 'photo',
              type: 'group',
              title: 'Title',
            },
            queryId: 'query id',
            receiver: {
              id: 1000,
              photoUrl: 'receiver photo',
              firstName: 'a',
              lastName: 'b',
              username: 'c',
              isBot: false,
              isPremium: false,
              languageCode: 'en',
            },
            startParam: 'param',
            user: {
              id: 2000,
              photoUrl: 'user photo',
              firstName: 'a',
              lastName: 'b',
              username: 'c',
              languageCode: 'en',
            },
          });
          expect(data2.authDate).toBe(authDate);
          expect(data2.canSendAfter).toBe(canSendAfter);
          expect(data2.chat).toStrictEqual({
            id: 999,
            photoUrl: 'photo',
            type: 'group',
            title: 'Title',
          });
          expect(data2.hash).toBe('joke');
          expect(data2.queryId).toBe('query id');
          expect(data2.receiver).toStrictEqual({
            id: 1000,
            photoUrl: 'receiver photo',
            firstName: 'a',
            lastName: 'b',
            username: 'c',
            isBot: false,
            isPremium: false,
            languageCode: 'en',
          });
          expect(data2.startParam).toBe('param');
          expect(data2.user).toStrictEqual({
            id: 2000,
            photoUrl: 'user photo',
            firstName: 'a',
            lastName: 'b',
            username: 'c',
            languageCode: 'en',
          });
        });
      });
    });
  });
});
