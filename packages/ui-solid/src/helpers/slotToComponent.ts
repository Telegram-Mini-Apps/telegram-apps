import type { Component } from 'solid-js';

import type { ComponentSlot } from '~/types/components.js';

/**
 * Converts component slot to component.
 * @param value - value to convert.
 */
export function slotToComponent<P>(value: ComponentSlot<P> | undefined): Component<P> | undefined {
  return value
    ? typeof value === 'function' ? value : () => value
    : undefined;
}
