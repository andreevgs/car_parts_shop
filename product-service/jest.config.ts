import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@libs/(.*)': '<rootDir>/src/libs/$1',
  }
}

export default jestConfig