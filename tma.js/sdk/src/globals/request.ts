import { requestFp as _requestFp, type RequestFpFn, type RequestFn } from '@tma.js/bridge';
import { BetterPromise } from 'better-promises';

import { postEventFp } from '@/globals/post-event.js';

export const requestFp: RequestFpFn = (method: any, events: any, options: any) => {
  return _requestFp(method, events, {
    postEvent: postEventFp,
    ...options,
  });
};

export const request: RequestFn = (...args: any[]) => {
  return BetterPromise.fn(() => (requestFp as any)(...args)());
};
