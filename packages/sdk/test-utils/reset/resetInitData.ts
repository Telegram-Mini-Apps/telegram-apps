import { resetSignal } from '@test-utils/reset/reset.js';

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
} from '@/scopes/components/init-data/init-data.js';

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