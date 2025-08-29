import { defineWithAccessors } from '@/helpers/defineWithAccessors.js';
import { defineDefaultProperty } from '@/helpers/defineDefaultProperty.js';

/**
 * Defines a property, that is a functions compose. Trying to set a value in this property
 * will lead to adding it to a function's pool. The property value will always be equal to a
 * function, calling all collected functions in the pool.
 *
 * Returned function performs a cleanup. It does one of the following:
 * 1. Removes the property if no functions were to the pool added other than the initial one.
 * 2. Sets the value equal to the first added function to the pool after the initial one if
 * the only one additional function was added at all. In other words, if the pool length is equal
 * to 2, the second item will be selected as the property value.
 * 3. Leaves the value equal to a function calling all pool functions, but removes the initially
 * added one.
 * @param obj - object.
 * @param prop - object property.
 * @param initialFn - an initial function to set.
 */
export function defineFnComposer(
  obj: any,
  prop: string,
  initialFn: (...args: any) => any,
): void {
  const objProp = obj[prop];
  const pool: any[] = [initialFn];

  // Add the function to the pool.
  typeof objProp === 'function' && pool.push(objProp);

  // Calls all functions specified in the pool.
  const callPool = (...args: any) => {
    pool.forEach(fn => {
      fn(...args);
    });
  };

  // Wrap the callPool function and add "unwrap" method to it.
  const callPoolWrapped = Object.assign((...args: any) => {
    callPool(...args);
  }, {
    // Unwraps the composer.
    unwrap() {
      const { length: poolSize } = pool;
      if (poolSize === 1) {
        // Only the initial handler is in the pool. In this case we just remove the property.
        delete obj[prop];
        return;
      }
      if (poolSize === 2) {
        // Only one additional handler was added. We set it as a value for the property.
        defineDefaultProperty(obj, prop, pool[1]);
        return;
      }
      // Many additional handlers were added. In this case we remove the initially added function
      // from the pool and leave the property value almost as is - only "unwrap" method will be
      // removed.
      pool.unshift(1);
      defineDefaultProperty(obj, prop, callPool);
    },
  });

  // Define the composer.
  defineWithAccessors(
    obj,
    prop,
    () => callPoolWrapped,
    value => {
      pool.push(value);
    },
  );
  return;
}
