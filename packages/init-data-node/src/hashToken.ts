import type { CreateHmacFn } from './types.js';

export function hashToken<H extends CreateHmacFn<any>>(
  token: string | Buffer,
  createHmac: H
): ReturnType<H> {
  return createHmac(token, 'WebAppData') as ReturnType<H>;
}
