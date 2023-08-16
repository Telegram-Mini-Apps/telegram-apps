import { Component } from 'solid-js';
import { mergeClassNames } from '@twa.js/utils';

import { WithClasses } from './types';

type MakeOptional<T, P extends keyof T> = Omit<T, P> & Partial<Pick<T, P>>;

interface Options {
  name?: string;
}

export function styled<P extends WithClasses<any>>(Component: Component<P>) {
  return (
    classes: Exclude<P['classes'], undefined>,
    options: Options = {},
  ): Component<MakeOptional<P, 'classes'>> => {
    function Styled(props: MakeOptional<P, 'classes'>) {
      return <Component {...props as any} classes={mergeClassNames(props.classes || {}, classes)}/>;
    }

    const { name: displayName = `Styled${Component.name}` } = options;

    Object.defineProperty(Styled, 'name', {
      value: displayName,
    });

    return Styled as Component<MakeOptional<P, 'classes'>>;
  };
}