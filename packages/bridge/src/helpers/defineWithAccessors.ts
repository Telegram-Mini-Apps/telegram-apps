/**
 * Defines an enumerable and configurable property with a getter and setter.
 * @param obj - object.
 * @param prop - object property name.
 * @param get - getter to use.
 * @param set - setter to use.
 */
export function defineWithAccessors(
  obj: any,
  prop: string,
  get: () => unknown,
  set: (v: any) => void,
) {
  Object.defineProperty(obj, prop, {
    enumerable: true,
    configurable: true,
    get,
    set,
  });
}