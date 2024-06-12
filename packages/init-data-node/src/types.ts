import { InitDataParsed } from '@tma.js/sdk';

export interface SignData extends Omit<InitDataParsed, 'authDate' | 'hash'> {
}

export interface SignDataSyncFn {
  (data: string, key: string): string;
}

export interface SignDataAsyncFn {
  (data: string, key: string): Promise<string>;
}
