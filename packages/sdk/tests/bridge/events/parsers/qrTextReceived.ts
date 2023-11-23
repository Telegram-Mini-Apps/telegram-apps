import { expect, it } from 'vitest';

import { qrTextReceived } from '~/bridge/events/index.js';

it('should return parsed value in case, passed value satisfies schema', () => {
  expect(qrTextReceived().parse({ data: 'ok' })).toStrictEqual({ data: 'ok' });
  expect(qrTextReceived().parse({})).toStrictEqual({});
  expect(qrTextReceived().parse({ data: 100 })).toStrictEqual({ data: '100' });
});
