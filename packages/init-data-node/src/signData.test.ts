import { describe, expect, it } from 'vitest';
import { signDataNode, signDataWeb } from './signData';

describe.each([
  ['signDataNode', signDataNode],
  ['signDataWeb', signDataWeb],
] as const)('%s', (_, fn) => {
  it('should use HMAC-SHA256 algorithm with key, based on HMAC-SHA256 keyed with the "WebAppData" value, applied to the secret token', async () => {
    expect(await fn('abc', 'my-secret-token'))
      .toBe('6ecc2e9b51f30dde6877ce374ede54eb626c84e78a5d9a9dcac54d2d248f6bde');
  });
});
