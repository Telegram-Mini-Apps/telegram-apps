import type { InputType } from '@storybook/types';

export function getClassesArgType(...elementKeys: string[]): InputType {
  return {
    description: [
      'Allows specifying specific component elements class names.',
      `Component element keys: \`${elementKeys.join('` `')}\``,
    ].join('\n\n'),
  };
}