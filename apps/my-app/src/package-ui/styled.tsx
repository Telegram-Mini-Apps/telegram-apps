import { Component } from 'solid-js';
import { mergeClassNames } from '@twa.js/utils';

import type { WithClasses } from './types.js';

type MakeOptional<T, P extends keyof T> = Omit<T, P> & Partial<Pick<T, P>>;

export interface StyledOptions {
  name?: string;
}

/**
 * Returns Higher Order Component which transfers passed properties adding specified classes.
 * @param Component - wrapped component.
 * @param classes - classes map.
 * @param options - additional options.
 */
export function styled<P extends WithClasses<any>>(
  Component: Component<P>,
  classes: Exclude<P['classes'], undefined>,
  options: StyledOptions = {},
): Component<MakeOptional<P, 'classes'>> {
  function Styled(props: MakeOptional<P, 'classes'>) {
    return <Component {...props as any} classes={mergeClassNames(props.classes, classes)}/>;
  }

  const { name: displayName = `Styled${Component.name}` } = options;

  Object.defineProperty(Styled, 'name', {
    value: displayName,
  });

  return Styled as Component<MakeOptional<P, 'classes'>>;
}