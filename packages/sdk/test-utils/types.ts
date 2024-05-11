import { SpyInstance } from 'vitest';

/**
 * Converts function to spy.
 */
export type FnToSpy<Fn extends (...args: any) => any> = SpyInstance<Parameters<Fn>, ReturnType<Fn>>;