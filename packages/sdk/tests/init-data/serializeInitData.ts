import { describe, expect, it } from 'vitest';

import { serializeInitData } from '~/init-data/index.js';

it('should pass "authDate" property to "auth_date" number by dividing its value by 1000', () => {
  expect(serializeInitData({
    authDate: new Date(1000),
    hash: '',
  })).toBe('auth_date=1&hash=');
});

([
  ['chatInstance', 'chat_instance', false],
  ['chatType', 'chat_type', false],
  ['hash', 'hash', true],
  ['queryId', 'query_id', false],
  ['startParam', 'start_param', false],
] as const).forEach(([from, to, required]) => {
  describe(from, () => {
    it(`should convert "${from}" property to "${to}" as is`, () => {
      expect(serializeInitData({
        authDate: new Date(1000),
        hash: '',
        [from]: 'test',
      })).toMatch(`${to}=test`);
    });

    if (required) {
      return;
    }

    it('should omit property if it is missing', () => {
      expect(serializeInitData({
        authDate: new Date(1000),
        hash: '',
      })).not.toMatch(to);
    });
  });
});

describe('canSendAfter', () => {
  it('should pass property to "can_send_after" as is', () => {
    expect(serializeInitData({
      authDate: new Date(1000),
      hash: '',
      canSendAfter: 92,
    })).toMatch('can_send_after=92');
  });

  it('should omit property if it is missing', () => {
    expect(serializeInitData({
      authDate: new Date(1000),
      hash: '',
    })).not.toMatch('can_send_after');
  });
});

describe('chat', () => {
  it('should convert "chat" property to "chat" stringifying object with properties "id", "type", "title", "photo_url", "username"', () => {
    expect(serializeInitData({
      authDate: new Date(1000),
      hash: '',
      chat: {
        type: 'channel',
        id: 11,
        username: 'chat123',
        title: 'Test',
        photoUrl: 'url',
      },
    })).toMatch('chat=%7B%22type%22%3A%22channel%22%2C%22id%22%3A11%2C%22username%22%3A%22chat123%22%2C%22title%22%3A%22Test%22%2C%22photo_url%22%3A%22url%22%7D');

    expect(serializeInitData({
      authDate: new Date(1000),
      hash: '',
      chat: {
        type: 'channel',
        id: 11,
        username: 'chat123',
        title: 'Test',
      },
    })).toMatch('chat=%7B%22type%22%3A%22channel%22%2C%22id%22%3A11%2C%22username%22%3A%22chat123%22%2C%22title%22%3A%22Test%22%7D');
  });
});

describe('user', () => {
  it('should convert "user" property to "user" stringifying object with properties "id", "first_name", "is_bot", "is_premium", "last_name", "language_code", "photo_url", "username"', () => {
    expect(serializeInitData({
      authDate: new Date(1000),
      hash: '',
      user: {
        id: 123,
        photoUrl: 'test',
        username: 'qbnk',
        isBot: false,
        languageCode: 'en',
        isPremium: false,
        lastName: 'Job',
        firstName: 'Done',
      },
    })).toMatch('user=%7B%22id%22%3A123%2C%22username%22%3A%22qbnk%22%2C%22photo_url%22%3A%22test%22%2C%22first_name%22%3A%22Done%22%2C%22last_name%22%3A%22Job%22%2C%22is_premium%22%3Afalse%2C%22language_code%22%3A%22en%22%2C%22is_bot%22%3Afalse%7D');
  });

  describe('receiver', () => {
    it('should convert "receiver" property to "receiver" stringifying object with properties "id", "first_name", "is_bot", "is_premium", "last_name", "language_code", "photo_url", "username"', () => {
      expect(serializeInitData({
        authDate: new Date(1000),
        hash: '',
        receiver: {
          id: 999,
          photoUrl: 'nnn',
          username: 'ddd',
          isBot: true,
          languageCode: 'ru',
          isPremium: true,
          lastName: 'bbb',
          firstName: 'ddd',
        },
      })).toMatch('receiver=%7B%22id%22%3A999%2C%22username%22%3A%22ddd%22%2C%22photo_url%22%3A%22nnn%22%2C%22first_name%22%3A%22ddd%22%2C%22last_name%22%3A%22bbb%22%2C%22is_premium%22%3Atrue%2C%22language_code%22%3A%22ru%22%2C%22is_bot%22%3Atrue%7D');
    });
  });
});
