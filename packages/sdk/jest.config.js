import tsConfig from 'jest-config-custom/ts';

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  ...tsConfig,
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
  ],
};
