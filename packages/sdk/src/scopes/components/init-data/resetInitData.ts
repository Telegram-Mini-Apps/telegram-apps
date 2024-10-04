import { resetSignal } from '@test-utils/reset.js';

import {
  raw,
  state,
  authDate,
  canSendAfterDate,
  canSendAfter,
  startParam,
  receiver,
  queryId,
  chat,
  chatType,
  chatInstance,
  hash,
  user,
} from './init-data.js';

export function resetInitData() {
  [
    raw,
    state,
    authDate,
    canSendAfterDate,
    canSendAfter,
    startParam,
    receiver,
    queryId,
    chat,
    chatType,
    chatInstance,
    hash,
    user,
  ].forEach(resetSignal);
}