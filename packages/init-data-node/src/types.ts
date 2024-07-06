import { InitDataParsed } from '@telegram-apps/sdk';

import type { SignDataOptions } from './signData.js';

export type Text = string | Buffer;

export type SignData = Omit<InitDataParsed, 'authDate' | 'hash'>;

export interface SignDataSyncFn {
  (data: Text, key: Text, options?: SignDataOptions): string;
}

export interface SignDataAsyncFn {
  (data: Text, key: Text, options?: SignDataOptions): Promise<string>;
}

/**
 * SHA-256 hashing function.
 */
export interface CreateHmacFn<Async extends boolean> {
  (data: Text, key: Text): Async extends true
    ? Promise<Buffer>
    : Buffer;
}

export interface SharedOptions {
  /**
   * True, if token is already hashed.
   * @default false
   */
  tokenHashed?: boolean;
}
