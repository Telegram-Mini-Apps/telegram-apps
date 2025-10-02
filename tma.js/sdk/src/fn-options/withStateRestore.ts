import { type ComponentStorage, createComponentSessionStorage } from '@/component-storage.js';
import { isPageReload } from '@/navigation.js';
import { createFnOption } from '@/fn-options/createFnOption.js';
import type { MaybeAccessor } from '@/types.js';

export interface WithStateRestore<T> {
  /**
   * A storage the component could use to store its data.
   */
  storage: ComponentStorage<T>;
  /**
   * True if the current page is reloaded.
   */
  isPageReload: MaybeAccessor<boolean>;
}

export function withStateRestore<S>(storageName: string) {
  return createFnOption<WithStateRestore<S>>({
    storage: createComponentSessionStorage<S>(storageName),
    isPageReload,
  });
}
