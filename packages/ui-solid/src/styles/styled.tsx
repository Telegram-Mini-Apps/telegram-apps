import { createMemo, mergeProps } from 'solid-js';
import type { Component } from 'solid-js';

import type {
  ClassesValue,
  ClassName,
  ClassNameFn,
  ExtractPropsClasses,
  WithOptionalClasses,
} from './types.js';

type StyledClasses<Props extends WithOptionalClasses<any, any>> =
  Partial<ExtractPropsClasses<Props>>;

function formatClasses<P>(value: ClassesValue<P>): (ClassName | ClassNameFn<P>)[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * Returns Higher Order Component which transfers passed properties adding specified classes.
 * @param Component - wrapped component.
 * @param classes - classes map.
 *
 * @example
 * const MyCheckbox = styled(Checkbox, {
 *   root: 'my-checkbox',
 *   input: 'my-checkbox__input',
 *   ...
 * });
 */
export function styled<Props extends WithOptionalClasses<any, any>>(
  Component: Component<Props>,
  classes: StyledClasses<Props>,
): Component<Props> {
  return (props) => {
    const merged = mergeProps({ classes: {} }, props);

    // Merge element keys from the passed properties and classes from HOC.
    // Concat classes keys passed from the parent component with the classes keys passed
    // from styled.
    const keys = createMemo(() => [
      ...new Set([
        ...Object.keys(merged.classes),
        ...Object.keys(classes),
      ]),
    ]);

    // Iterate over each found key, extract its value from both class maps and merge into a single
    // array.
    const mergedClasses = createMemo(() => {
      return keys().reduce<StyledClasses<Props>>((acc, key) => {
        (acc as any)[key] = [
          ...formatClasses((merged.classes as any)[key]),
          ...formatClasses(classes[key]),
        ];
        return acc;
      }, {});
    });

    return <Component {...props} classes={mergedClasses()}/>;
  };
}
