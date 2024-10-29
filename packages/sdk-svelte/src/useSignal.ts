import { onDestroy } from 'svelte';
import { writable, Writable } from 'svelte/store';

/**
 * Returns the underlying signal value updating it each time the signal value changes.
 * @param signal - a signal.
 */
export function useSignal<T>(signal: {
    (): T;
    sub(fn: (v: T) => void): VoidFunction;
}): Writable<T> {
    const _value = writable<T>();
    const unsub = signal.sub((value) => {
        _value.set(value);
    });
    onDestroy(unsub);

    return _value;
}