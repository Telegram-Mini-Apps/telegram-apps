// This script optimizes icons, placed in the "icons" folder.

import { optimize } from 'svgo';
import { readdirSync, readFileSync, writeFileSync, rmdirSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const svgIconsDir = resolve(dirname(fileURLToPath(import.meta.url)), '../icons');
const solidIconsDir = resolve(svgIconsDir, '../src/icons');

// Clean target Solid components directory.
rmSync(solidIconsDir, { recursive: true });
mkdirSync(solidIconsDir);

// List of collected components names.
const collectedComponents = [];

readdirSync(svgIconsDir).forEach(file => {
  const filePath = resolve(svgIconsDir, file);

  // Optimize SVG.
  const { data: svg } = optimize(readFileSync(filePath), {
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

  // Compute size based on the icon name.
  const [, size] = file.match(/(\d+)\.svg$/).map(Number);

  // Compute component name
  const component = parse(file)
    .name
    .split('_')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('');
  collectedComponents.push(component);

  // Compute Solid component TypeScript file content.
  const result =
    `/* eslint-disable */
import { mergeProps, type Component } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

export interface ${component}Props extends JSXIntrinsicElementAttrs<'svg'> {
  /**
   * Icon size. This is value will be passed to the SVG's width and height attributes.
   * @default ${size}
   */
  size?: JSXIntrinsicElementAttrs<'svg'>['width'];
}

export const ${component}: Component<${component}Props> = (props) => {
  const merged = mergeProps({ size: ${size} }, props);

  return (
    ${svg
      .replace(/([{}])/g, '{\'$1\'}')
      .replace(/<!--\s*([\s\S]*?)\s*-->/g, '{/* $1 */}')
      .replace(/(<svg[^>]*)>/i, '$1 width={merged.size} height={merged.size} {...props}>')}
  );
}
`;

  // Write optimized svg.
  writeFileSync(filePath, svg);

  // Write Solid component.
  writeFileSync(resolve(solidIconsDir, `${component}.tsx`), result);
});

// Write Solid components index file.
writeFileSync(
  resolve(solidIconsDir, 'index.ts'),
  collectedComponents.map(component => `export * from './${component}.js';\n`)
    .sort()
    .join('') + '\n',
);
