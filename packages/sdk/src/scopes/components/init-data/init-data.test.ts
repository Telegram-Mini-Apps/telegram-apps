import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { InitData } from '@telegram-apps/types';

import { resetPackageState } from '@test-utils/utils.js';

import { raw, state, restore } from './init-data.js';

vi.mock('@telegram-apps/bridge', async () => {
  const m = await vi.importActual('@telegram-apps/bridge');

  return {
    ...m,
    postEvent() {
    },
    retrieveLaunchParams: () => ({
      tgWebAppData: {
        auth_date: new Date(1000),
        can_send_after: 60,
        chat: {
          id: 999,
          photo_url: 'photo',
          type: 'group',
          title: 'Title',
        },
        chat_type: 'sender',
        chat_instance: 'abc',
        hash: 'joke',
        query_id: 'query id',
        receiver: {
          id: 1000,
          photo_url: 'receiver photo',
          first_name: 'a',
          last_name: 'b',
          username: 'c',
          is_bot: false,
          is_premium: false,
          language_code: 'en',
        },
        start_param: 'param',
        user: {
          id: 2000,
          photo_url: 'user photo',
          first_name: 'a',
          last_name: 'b',
          username: 'c',
          language_code: 'en',
        },
        signature: ''
      } satisfies InitData,
    }),
  };
});

beforeEach(() => {
  resetPackageState();
});

describe('restore', () => {
  it('should set state based on init data from launch params', () => {
    restore();
    expect(state()).toStrictEqual({
      auth_date: new Date(1000),
      can_send_after: 60,
      chat: {
        id: 999,
        photo_url: 'photo',
        type: 'group',
        title: 'Title',
      },
      chat_type: 'sender',
      chat_instance: 'abc',
      hash: 'joke',
      query_id: 'query id',
      receiver: {
        id: 1000,
        photo_url: 'receiver photo',
        first_name: 'a',
        last_name: 'b',
        username: 'c',
        is_bot: false,
        is_premium: false,
        language_code: 'en',
      },
      start_param: 'param',
      user: {
        id: 2000,
        photo_url: 'user photo',
        first_name: 'a',
        last_name: 'b',
        username: 'c',
        language_code: 'en',
      },
      signature: ''
    });
    expect(raw()).toBe('auth_date=1&can_send_after=60&chat=%7B%22id%22%3A999%2C%22photo_url%22%3A%22photo%22%2C%22type%22%3A%22group%22%2C%22title%22%3A%22Title%22%7D&chat_type=sender&chat_instance=abc&hash=joke&query_id=query+id&receiver=%7B%22id%22%3A1000%2C%22photo_url%22%3A%22receiver+photo%22%2C%22first_name%22%3A%22a%22%2C%22last_name%22%3A%22b%22%2C%22username%22%3A%22c%22%2C%22is_bot%22%3Afalse%2C%22is_premium%22%3Afalse%2C%22language_code%22%3A%22en%22%7D&start_param=param&user=%7B%22id%22%3A2000%2C%22photo_url%22%3A%22user+photo%22%2C%22first_name%22%3A%22a%22%2C%22last_name%22%3A%22b%22%2C%22username%22%3A%22c%22%2C%22language_code%22%3A%22en%22%7D&signature=');
  });
});