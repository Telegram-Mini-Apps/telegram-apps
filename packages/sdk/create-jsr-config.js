import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(resolve(fileURLToPath(import.meta.url)));
const packageJson = JSON.parse(readFileSync(resolve(dir, 'package.json')).toString());

writeFileSync(resolve(dir, 'jsr.json'), JSON.stringify({
  name: '@tma/sdk',
  version: packageJson.version,
  exports: './src/index.ts',
}));
