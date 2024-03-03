import type { InputType } from '@storybook/types';

interface GetClassesArgTypeOptions {
  elementKeys: string[];
  component: string;
}

export function getClassesArgType(options: GetClassesArgTypeOptions): InputType {
  const { elementKeys, component } = options;
  const example = JSON.stringify(
    elementKeys.reduce<Record<string, string>>((acc, key) => {
      acc[key] = `my-${component}__${key}`;
      return acc;
    }, {}),
    null,
    2,
  );

  return {
    description: [
      'Object, which allows appending specified class names to the component elements.',
      `Allowed element keys: \`'${elementKeys.join('\' | \'')}'\``,
      'Example:',
      ['```json', example, '```'].join('\n'),
    ].join('\n\n'),
  };
}