import { nodeResolve } from '@rollup/plugin-node-resolve';
import type { UserConfig } from 'vite';

import { createViteConfig, type CreateViteConfigOptions } from './createViteConfig.js';

type Options = Omit<CreateViteConfigOptions, 'test' | 'formats' | 'declarations' | 'emptyOutDir'>;

export function createViteIIFEConfig({ plugins = [], ...rest }: Options): UserConfig {
  return createViteConfig({
    ...rest,
    formats: ['iife'],
    declarations: false,
    emptyOutDir: false,
    plugins: [...plugins, nodeResolve()],
  });
}