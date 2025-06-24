import { defineWithAccessors } from '@/helpers/defineWithAccessors.js';

/**
 * Wires the specified property in the object preventing it from being overwritten. Instead, it
 * enhances the previous value by merging the current one with the passed one.
 * @param obj - object.
 * @param prop - object property to rewire.
 */
export function defineEnhanceableProperty(obj: any, prop: string): void {
  let value = obj[prop];
  defineWithAccessors(obj, prop, () => value, v => {
    value = { ...value, ...v };
  });
}