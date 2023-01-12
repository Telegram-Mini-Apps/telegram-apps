import {Bridge} from 'twa-bridge';

export type BridgeLike = Pick<Bridge, 'postEvent' | 'off' | 'on'>;