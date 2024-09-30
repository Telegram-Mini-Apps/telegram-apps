import type { AsyncOptions } from '@telegram-apps/toolkit';

import type { PostEventFn } from '@/methods/postEvent.js';

export interface ExecuteWithPostEvent {
  /**
   * Custom function to call mini apps methods.
   */
  postEvent?: PostEventFn;
}

export interface ExecuteWithOptions extends AsyncOptions, ExecuteWithPostEvent {
}
