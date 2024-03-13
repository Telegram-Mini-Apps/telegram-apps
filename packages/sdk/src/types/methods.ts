import type { PostEvent } from '../bridge/index.js';

export interface ExecuteWithTimeout {
  /**
   * Timeout to execute method.
   */
  timeout?: number;
}

export interface ExecuteWithPostEvent {
  /**
   * postEvent function to use to call Telegram Mini Apps methods.
   */
  postEvent?: PostEvent;
}

export interface ExecuteWithOptions extends ExecuteWithTimeout, ExecuteWithPostEvent {
}
