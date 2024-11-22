import {computed, signal} from '@telegram-apps/signals';

import {SafeAreaInset} from "@telegram-apps/bridge";
import {State} from "@/scopes/components/safe-area/types.js";

export const initialValue: SafeAreaInset = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

/**
 * Signal with SafeAreaInset object state.
 */
export const inset = signal<SafeAreaInset>(initialValue);

/**
 * Signal with ContentSafeAreaInset object state.
 */
export const contentInset = signal<SafeAreaInset>(initialValue);

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * True if CSS variables are currently bound.
 */
export const isCssVarsBound = signal(false);

/**
 * True if the component is currently mounting.
 */
export const isMounting = signal<boolean>(false);

/**
 * Error occurred while mounting the component.
 */
export const mountError = signal<Error | undefined>(undefined);


/**
 * Complete component state.
 */
export const state = computed<State>(() => ({
  inset: inset(),
  contentInset: contentInset(),
}));