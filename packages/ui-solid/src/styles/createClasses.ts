import { classNames } from '@tma.js/sdk';
import { createMemo } from 'solid-js';
import type { Accessor } from 'solid-js';

import type { ClassName, ClassNameFn, ClassNamesMap, WithOptionalClasses } from './types.js';

type InferElementKey<Props> = Props extends WithOptionalClasses<infer ElementKey, any>
  ? ElementKey
  : never;

/**
 * Accepts component properties and returns accessor returning a map with computed elements
 * classes.
 * @returns Reactive object with keys as element keys and values as computed class property values.
 * @param propsOrGetProps - properties or properties accessor.
 */
export function createClasses<Props extends WithOptionalClasses<any, Props>>(
  propsOrGetProps: Props | Accessor<Props>,
): Accessor<ClassNamesMap<InferElementKey<Props>>> {
  return createMemo(() => {
    const props = typeof propsOrGetProps === 'function' ? propsOrGetProps() : propsOrGetProps;
    const computeValue = (classNameOrFunc: ClassName | ClassNameFn<Props>) => {
      return typeof classNameOrFunc === 'function' ? classNameOrFunc(props) : classNameOrFunc;
    };

    return Object
      .entries(props.classes || {})
      .reduce<ClassNamesMap<InferElementKey<Props>>>((acc, [className, value]) => {
        Object.defineProperty(acc, className, {
          enumerable: true,
          get: createMemo(() => {
            return classNames(
              Array.isArray(value) ? value.map(computeValue) : computeValue(value),
            ) || undefined;
          }),
        });
        return acc;
      }, {});
  });
}
