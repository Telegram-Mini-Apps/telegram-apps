import {computed, signal} from '@telegram-apps/signals';

import {SafeAreaInset} from "@telegram-apps/bridge";
import {State} from "@/scopes/components/safe-area/types.js";

const initialValue: SafeAreaInset = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

/**
 * Signal with SafeAreaInset object state.
 */
export const safeAreaInset = signal<SafeAreaInset>(initialValue);

/**
 * Signal with ContentSafeAreaInset object state.
 */
export const contentSafeAreaInset = signal<SafeAreaInset>(initialValue);

/**
 * True if the component is currently mounted.
 */
export const isMounted = signal(false);

/**
 * True if CSS variables are currently bound.
 */
export const isCssVarsBound = signal(false);

/**
 * Complete component state.
 */
export const state = computed<State>(() => ({
  safeAreaInset: safeAreaInset(),
  contentSafeAreaInset: contentSafeAreaInset(),
}));

export const safeAreaInsetTop = computed(() => safeAreaInset()['top']);
export const safeAreaInsetBottom = computed(() => safeAreaInset()['bottom']);
export const safeAreaInsetLeft = computed(() => safeAreaInset()['left']);
export const safeAreaInsetRight = computed(() => safeAreaInset()['right']);

export const contentSafeAreaInsetTop = computed(() => contentSafeAreaInset()['top']);
export const contentSafeAreaInsetBottom = computed(() => contentSafeAreaInset()['bottom']);
export const contentSafeAreaInsetLeft = computed(() => contentSafeAreaInset()['left']);
export const contentSafeAreaInsetRight = computed(() => contentSafeAreaInset()['right']);
