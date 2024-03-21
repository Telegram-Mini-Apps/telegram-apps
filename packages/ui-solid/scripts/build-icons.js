// This script optimizes icons, placed in the "icons" folder.

import { optimize } from 'svgo';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../icons');

readdirSync(dir).forEach(file => {
  const filePath = resolve(dir, file);
  const { name } = parse(filePath);
  let { data: svg } = optimize(readFileSync(filePath), {
    multipass: true,
    plugins: [
      'preset-default',
      'removeDimensions',
      // Replace static colors which were meant to be dynamic to really dynamic.
      // https://svgo.dev/docs/plugins/convert-colors/
      {
        name: 'convertColors',
        params: {
          currentColor: /#007AFF/,
        },
      },
    ],
  });

  const component = 'Icon' + parse(filePath)
    .name
    .split('_')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('');
  const result =
    `import type { Component } from 'solid-js';
import type { JSXIntrinsicElementAttrs } from '../types/jsx.js';

export const ${component}: Component<JSXIntrinsicElementAttrs<'svg'>> = (props) => {
  return (
    ${svg
      .replace(/([{}])/g, '{\'$1\'}')
      .replace(/<!--\s*([\s\S]*?)\s*-->/g, '{/* $1 */}')
      .replace(/(<svg[^>]*)>/i, '$1 {...props}>')}
  );
}
`;

  // Write optimized svg.
  writeFileSync(filePath, svg);

  // Write Solid component.
  writeFileSync(resolve(dir, '../src/icons', `${component}.tsx`), result);
});
