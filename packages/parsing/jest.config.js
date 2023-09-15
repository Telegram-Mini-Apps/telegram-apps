import tsConfig from 'jest-config-custom/ts';

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  ...tsConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 0,
    },
  },
};
