import { expect, it } from 'vitest';

import { serializeInitDataQuery } from '@/serializers/serializeInitDataQuery.js';

it('should properly serialize the value', () => {
  expect(
    serializeInitDataQuery({
      auth_date: new Date(1000),
      hash: 'Hash',
      signature: 'Signature',
      user: {
        id: 1,
        first_name: 'Pavel',
      },
      chat_instance: '-293',
      chat_type: 'group',
      chat: {
        id: 3,
        username: 'pavel',
        title: 'Some title',
        photo_url: '',
        type: 'self',
      },
      can_send_after: 911,
      query_id: 'QueryID',
      receiver: {
        id: 2,
        first_name: 'Pavel Buddy',
      },
      start_param: 'StartParam',
      additional_prop: 'PROP',
      prop1: ['a', 'b'],
    }),
  ).toBe('auth_date=1&hash=Hash&signature=Signature&user=%7B%22id%22%3A1%2C%22first_name%22%3A%22Pavel%22%7D&chat_instance=-293&chat_type=group&chat=%7B%22id%22%3A3%2C%22username%22%3A%22pavel%22%2C%22title%22%3A%22Some+title%22%2C%22photo_url%22%3A%22%22%2C%22type%22%3A%22self%22%7D&can_send_after=911&query_id=QueryID&receiver=%7B%22id%22%3A2%2C%22first_name%22%3A%22Pavel+Buddy%22%7D&start_param=StartParam&additional_prop=PROP&prop1=a&prop1=b');
});