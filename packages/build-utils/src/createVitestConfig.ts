import type { InlineConfig, CoverageOptions, VitestEnvironment } from 'vitest';

interface Options {
  environment?: VitestEnvironment;
  coverage?: Omit<CoverageOptions<'v8'>, 'provider'>;
}

export function createVitestConfig(options: Options = {}): InlineConfig {
  const {
    environment,
    coverage,
  } = options;
  const config: InlineConfig = {
    include: ['tests/**/*.ts'],
  };

  if (environment) {
    config.environment = environment;
  }

  if (coverage) {
    config.coverage = {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/index.ts'],
      ...coverage,
    };
  }

  return config;
}