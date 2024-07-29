import { beforeEach, describe, expect, it, vi } from 'vitest';

import { state, restore } from './initData.js';
import type { InitData } from './types.js';

vi.mock('@/launch-params/retrieveLaunchParams.js', () => ({
  retrieveLaunchParams: () => ({
    initData: {
      authDate: new Date(1000),
      canSendAfter: 60,
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
        firstName: 'a',f
        lastName: 'b',
        username: 'c',
        languageCode: 'en',
      },
    } satisfies InitData,
  }),
}));

beforeEach(() => {
  state.set(undefined);
});

describe('init', () => {
  it('should set state based on init data from launch params', () => {
    restore();
    expect(state()).toStrictEqual({
      authDate: new Date(1000),
      canSendAfter: 60,
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
  });
});
