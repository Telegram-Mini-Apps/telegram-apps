import { expect, it } from 'vitest';
import { createHmac } from './hmac.js';

it(
  'should use HMAC-SHA256 algorithm with key, based on HMAC-SHA256 keyed with the "WebAppData" value, applied to the secret token',
  async () => {
    expect(Buffer.from(await createHmac('data123', 'my-secret-key')).toString('hex'))
      .toBe('d834d96e53d71451bdc56691d0f01c3f0132fa2d404eb7618593ea0d13252642');
  },
);
