/**
 * Defines an enumerable, configurable and writable property with the initial value.
 * @param obj - object.
 * @param prop - object property name.
 * @param value - value to set.
 */
export function defineStaticProperty(obj: any, prop: string, value: any): void {
  Object.defineProperty(obj, prop, {
    enumerable: true,
    configurable: true,
    writable: true,
    value,
  });
}
