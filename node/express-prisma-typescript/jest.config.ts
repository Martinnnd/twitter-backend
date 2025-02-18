import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@domains$': '<rootDir>/src/domains',

    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@utils$': '<rootDir>/src/utils',

    '^@test/(.*)$': '<rootDir>/src/test/$1',
  },
};

export default config;