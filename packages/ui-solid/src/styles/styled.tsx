import type { Component } from 'solid-js';
import { mergeProps } from 'solid-js';

import type { Classes, InferPropsElementKey, WithOptionalClasses } from './types.js';

export interface StyledOptions {
  /**
   * Returned wrapper component name.
   */
  name?: string;
}

type StyledClasses<Props> = Classes<InferPropsElementKey<Props>, Props>;

/**
 * Returns Higher Order Component which transfers passed properties adding specified classes.
 * @param Component - wrapped component.
 * @param classes - classes map.
 * @param options - additional options.
 *
 * @example
 * const MyCheckbox = styled(Checkbox, {
 *   root: 'my-checkbox',
 *   input: 'my-checkbox__input',
 *   ...
 * });
 */
export function styled<
  Props extends WithOptionalClasses<any, ClassesProps>,
  ClassesProps = Props,
>(
  Component: Component<Props>,
  classes: StyledClasses<ClassesProps>,
  options: StyledOptions = {},
): Component<Props> {
  const Wrapped: Component<Props> = (props) => {
    const mergedProps = mergeProps({ classes: {} }, props);

    // Merge element keys from the passed properties and classes from HOC.
    const keys: Set<InferPropsElementKey<Props>> = new Set([
      ...Object.keys(mergedProps.classes),
      ...Object.keys(classes),
    ] as InferPropsElementKey<Props>[]);

    const mergedClasses = [...keys]
      .reduce<StyledClasses<ClassesProps>>((acc, key) => {
        (acc as any)[key] = [
          (mergedProps.classes as any)[key],
          (classes as any)[key as any],
        ];
        return acc;
      }, {});

    return <Component {...props as any} classes={mergedClasses}/>;
  };

  Object.defineProperty(Wrapped, 'name', {
    value: options.name || `Styled${Component.name}`,
  });

  return Wrapped;
}
