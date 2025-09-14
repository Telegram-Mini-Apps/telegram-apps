import type { Version } from '@tma.js/types';
import type { PostEventFpFn } from '@tma.js/bridge';

import type { MaybeAccessor } from '@/types.js';
import type { ComponentStorage } from '@/component-storage.js';

export interface WithVersion {
  /**
   * The currently supported Telegram Mini Apps version by the Telegram client.
   */
  version: MaybeAccessor<Version>;
}

export interface WithPostEvent {
  /**
   * A postEvent function to use to call Mini Apps methods.
   */
  postEvent: PostEventFpFn;
}

export interface WithStorage<T extends ComponentStorage<any>> {
  /**
   * A storage the component could use to store its data.
   */
  storage: T;
}

export interface SharedComponentOptions {
  /**
   * True if the current environment is Telegram Mini Apps.
   */
  isTma: MaybeAccessor<boolean>;
}
