import { describe, expect, it } from 'vitest';

import { signNode, signWeb } from './sign';

describe.each([
  ['signNode', signNode],
  ['signWeb', signWeb],
] as const)('%s', (_, fn) => {
  it('should correctly sign data', async () => {
    expect(
      await fn(
        {
          canSendAfter: 10000,
          chat: {
            id: 1,
            type: 'group',
            username: 'my-chat',
            title: 'chat-title',
            photoUrl: 'chat-photo',
          },
          chatInstance: '888',
          chatType: 'sender',
          queryId: 'QUERY',
          receiver: {
            addedToAttachmentMenu: false,
            allowsWriteToPm: true,
            firstName: 'receiver-first-name',
            id: 991,
            isBot: false,
            isPremium: true,
            languageCode: 'ru',
            lastName: 'receiver-last-name',
            photoUrl: 'receiver-photo',
            username: 'receiver-username',
          },
          startParam: 'debug',
          user: {
            addedToAttachmentMenu: false,
            allowsWriteToPm: false,
            firstName: 'user-first-name',
            id: 222,
            isBot: true,
            isPremium: false,
            languageCode: 'en',
            lastName: 'user-last-name',
            photoUrl: 'user-photo',
            username: 'user-username',
          },
        },
        '5768337691:AAH5YkoiEuPk8-FZa32hStHTqXiLPtAEhx8',
        new Date(1000),
      ),
    ).toBe('auth_date=1&can_send_after=10000&chat=%7B%22id%22%3A1%2C%22type%22%3A%22group%22%2C%22title%22%3A%22chat-title%22%2C%22photo_url%22%3A%22group%22%2C%22username%22%3A%22my-chat%22%7D&chat_instance=888&chat_type=sender&query_id=QUERY&receiver=%7B%22added_to_attachment_menu%22%3Afalse%2C%22allows_write_to_pm%22%3Atrue%2C%22first_name%22%3A%22receiver-first-name%22%2C%22id%22%3A991%2C%22is_bot%22%3Afalse%2C%22is_premium%22%3Atrue%2C%22language_code%22%3A%22ru%22%2C%22last_name%22%3A%22receiver-last-name%22%2C%22photo_url%22%3A%22receiver-photo%22%2C%22username%22%3A%22receiver-username%22%7D&start_param=debug&user=%7B%22added_to_attachment_menu%22%3Afalse%2C%22allows_write_to_pm%22%3Afalse%2C%22first_name%22%3A%22user-first-name%22%2C%22id%22%3A222%2C%22is_bot%22%3Atrue%2C%22is_premium%22%3Afalse%2C%22language_code%22%3A%22en%22%2C%22last_name%22%3A%22user-last-name%22%2C%22photo_url%22%3A%22user-photo%22%2C%22username%22%3A%22user-username%22%7D&hash=47cfa22e72b887cba90c9cb833c5ea0f599975b6ce7193741844b5c4a4228b40');
  });
});
