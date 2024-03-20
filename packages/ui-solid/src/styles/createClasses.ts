import { classNames } from '@tma.js/sdk';
import type { Accessor } from 'solid-js';
import { createMemo } from 'solid-js';

import type { ClassNamesMap, WithOptionalClasses } from './types.js';

type InferElementKey<Props> = Props extends WithOptionalClasses<infer ElementKey, any>
  ? ElementKey
  : never;

/**
 * TODO: Re-check the description.
 * Creates a map, where key is an element key and value is a set of class names, which should
 * be applied to this element.
 *
 * This function accepts properties, passed to components. Properties set should include
 * the "classes" property, which describes class names computers for each element.
 *
 * The classes property is not tracked by this function. So, this function will only process
 * its initial value. For developers, it means, that this property value should always remain
 * the same to work properly. Developer should also not mutate any of the values of this
 * map as long as these mutations will be ignored.
 *
 * Returned object is reactive. So, its values changes are trackable and work the way, props object
 * do in Solid.
 * @returns Reactive object with keys as element keys and values as computed class property values.
 * @param propsOrGetProps
 */
export function createClasses<Props extends WithOptionalClasses<any, Props>>(
  propsOrGetProps: Props | Accessor<Props>,
): Accessor<ClassNamesMap<InferElementKey<Props>>> {
  return createMemo(() => {
    const props = typeof propsOrGetProps === 'function' ? propsOrGetProps() : propsOrGetProps;

    return Object
      .entries(props.classes || {})
      .reduce<ClassNamesMap<InferElementKey<Props>>>((acc, [className, value]) => {
        Object.defineProperty(acc, className, {
          get: createMemo(() => {
            return classNames(
              Array.isArray(value)
                ? value.map((item) => {
                  return typeof item === 'function' ? item(props) : item;
                })
                : typeof value === 'function' ? value(props) : value,
            ) || undefined;
          }),
          enumerable: true,
        });
        return acc;
      }, {});
  });
}
