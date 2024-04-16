import { expect, it } from 'vitest';

import { InitData } from './InitData.js';

it('should return fields specified in constructor', () => {
  const authDate = new Date(123);
  const data1 = new InitData({ authDate, hash: 'hash' });
  expect(data1.authDate).toBe(authDate);
  expect(data1.canSendAfter).toBeUndefined();
  expect(data1.chat).toBeUndefined();
  expect(data1.chatType).toBeUndefined();
  expect(data1.chatInstance).toBeUndefined();
  expect(data1.hash).toBe('hash');
  expect(data1.queryId).toBeUndefined();
  expect(data1.receiver).toBeUndefined();
  expect(data1.startParam).toBeUndefined();
  expect(data1.user).toBeUndefined();

  const canSendAfter = 1;
  const data2 = new InitData({
    authDate,
    canSendAfter,
    chat: {
      id: 999,
      photoUrl: 'photo',
      type: 'group',
      title: 'Title',
    },
    chatType: 'sender',
    chatInstance: 'abc',
    hash: 'joke',
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
  expect(data2.chatType).toBe('sender');
  expect(data2.chatInstance).toBe('abc');
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

it('should have canSendAfterData equal to authDate + canSendAfter seconds', () => {
  const authDate = new Date();
  const initData = new InitData({
    authDate,
    hash: 'abc',
    canSendAfter: 32000,
  });

  expect(initData.canSendAfter).toBe(32000);
  expect(initData.canSendAfterDate).toStrictEqual(
    new Date(authDate.getTime() + 32000000),
  );
});
