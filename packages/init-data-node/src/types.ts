import { InitDataParsed } from '@tma.js/sdk';

export interface SignData extends Omit<InitDataParsed, 'authDate' | 'hash'> {
}