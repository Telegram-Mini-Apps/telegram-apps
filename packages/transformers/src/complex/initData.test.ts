import { toSearchParams } from 'test-utils';
import { describe, expect, it } from 'vitest';

import { initData } from './initData.js';

describe('auth_date', () => {
  it('should throw an error in case, this property is missing', () => {
    expect(() => initData()(toSearchParams({ hash: 'abcd' }))).toThrow();
  });

  it('should parse source property as Date and pass it to the "authDate" property', () => {
    expect(initData()(toSearchParams({ auth_date: 1, hash: 'abcd' }))).toMatchObject({
      authDate: new Date(1000),
    });
  });
});

describe('can_send_after', () => {
  it('should parse source property as Date and pass it to the "canSendAfter" property', () => {
    expect(
      initData()(toSearchParams({
        auth_date: 1,
        hash: 'abcd',
        can_send_after: 8882,
      })),
    ).toMatchObject({
      canSendAfter: 8882,
    });
  });
});

describe('chat', () => {
  it('should parse source property as Chat and pass it to the "chat" property', () => {
    expect(
      initData()(toSearchParams({
        auth_date: 1,
        hash: 'abcd',
        chat: {
          id: 5,
          type: 'group chat',
          title: 'My Chat',
          photo_url: 'https://johny.com',
          username: 'Johny Chat',
        },
      })),
    ).toMatchObject({
      chat: {
        id: 5,
        type: 'group chat',
        title: 'My Chat',
        photoUrl: 'https://johny.com',
        username: 'Johny Chat',
      },
    });
  });
});

describe('hash', () => {
  it('should throw an error in case, this property is missing', () => {
    expect(
      () => initData()(toSearchParams({
        auth_date: 1,
      })),
    ).toThrow();
  });

  it('should parse source property as string and pass it to the "hash" property', () => {
    expect(
      initData()(toSearchParams({
        auth_date: 1,
        hash: 'abcd',
      })),
    ).toMatchObject({
      hash: 'abcd',
    });
  });
});

describe.each([
  { from: 'chat_instance', to: 'chatInstance' },
  { from: 'chat_type', to: 'chatType' },
  { from: 'query_id', to: 'queryId' },
  { from: 'start_param', to: 'startParam' },
])('$from', ({ from, to }) => {
  it(`should parse source property as string and pass it to the "${to}" property`, () => {
    expect(
      initData()(toSearchParams({
        auth_date: 1,
        hash: 'abcd',
        [from]: 'my custom property',
      })),
    ).toMatchObject({
      [to]: 'my custom property',
    });
  });
});

describe.each(['user', 'receiver'])('%s', (property) => {
  it('should parse source property as User and pass it to the property with the same name', () => {
    expect(
      initData()(toSearchParams({
        auth_date: 1,
        hash: 'abcd',
        [property]: {
          added_to_attachment_menu: true,
          allows_write_to_pm: false,
          first_name: 'Johny',
          id: 333,
          is_bot: false,
          is_premium: true,
          language_code: 'en',
          last_name: 'Bravo',
          photo_url: 'https://johny.com',
          username: 'johnybravo',
        },
      })),
    ).toMatchObject({
      [property]: {
        addedToAttachmentMenu: true,
        allowsWriteToPm: false,
        firstName: 'Johny',
        id: 333,
        isBot: false,
        isPremium: true,
        languageCode: 'en',
        lastName: 'Bravo',
        photoUrl: 'https://johny.com',
        username: 'johnybravo',
      },
    });
  });
});
