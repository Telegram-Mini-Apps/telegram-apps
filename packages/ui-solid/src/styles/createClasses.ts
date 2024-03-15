import { classNames } from '@tma.js/sdk';
import type { Accessor } from 'solid-js';
import { createMemo } from 'solid-js';

import type {
  ClassesClassName,
  ClassNamesMap,
  ComputeClassNamesFn,
  WithOptionalClasses,
} from './types.js';

type InferElementKey<Props> = Props extends WithOptionalClasses<infer ElementKey, any>
  ? ElementKey
  : never;

type GetterFn = () => string | undefined;

function getNonArrayBasedGetter<Props>(
  value: ClassesClassName | ComputeClassNamesFn<Props>,
  props: Props,
): GetterFn {
  return () => {
    return classNames(
      typeof value === 'function'
        ? value(props)
        : value,
    ) || undefined;
  };
}

function getArrayBasedGetter<Props>(
  value: (ClassesClassName | ComputeClassNamesFn<Props>)[],
  props: Props,
): GetterFn {
  const [nonDynamic, dynamic] = value
    .reduce<[string, Accessor<ClassesClassName | ClassesClassName[]>[]]>((acc, item) => {
      if (typeof item === 'function') {
        // Item is a function, it should be added to the dynamic part.
        acc[1].push(createMemo(() => item(props)));
      } else {
        // Item is not a function, it should be added to the static part.
        acc[0] += classNames(item);
      }

      return acc;
    }, ['', []]);

  return () => {
    console.log(dynamic.map((m) => m()));
    console.warn(classNames(dynamic.map((m) => m())));
    return classNames(nonDynamic, dynamic.map((m) => m()));
  };
}

/**
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
 * @param props - properties, passed to a component.
 * @returns Reactive object with keys as element keys and values as computed class property values.
 */
export function createClasses<Props extends WithOptionalClasses<any, any>>(
  props: Props,
): ClassNamesMap<InferElementKey<Props>> {
  if (!props.classes) {
    return {};
  }

  const result: ClassNamesMap<InferElementKey<Props>> = {};

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const elementKey in props.classes) {
    const value = props.classes[elementKey];
    if (value) {
      Object.defineProperty(result, elementKey, {
        get: createMemo(
          Array.isArray(value)
            ? getArrayBasedGetter(value, props)
            : getNonArrayBasedGetter(value, props),
        ),
        enumerable: true,
      });
    }
  }

  return result;
}
