import type { InitData } from '@telegram-apps/types';

import type { SignDataOptions } from './signData.js';

export type Text = string | ArrayBuffer;

export type SignData = Omit<InitData, 'authDate' | 'hash'>;

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
  (data: Text, key: Text): Async extends true ? Promise<ArrayBuffer> : ArrayBuffer;
}

/**
 * 3-rd party verification function.
 */
export interface Verify3rdFn<Async extends boolean> {
  (data: string, key: string, signature: string): Async extends true ? Promise<boolean> : boolean;
}

export interface SharedOptions {
  /**
   * True, if token is already hashed.
   * @default false
   */
  tokenHashed?: boolean;
}
