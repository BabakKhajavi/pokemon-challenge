module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/unit/**/*.test.ts', '<rootDir>/tests/unit/**/*.test.tsx'],
  transform: {
    '^.+\\.[jt]sx?$': ['@swc/jest', {
      jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } }, target: 'es2022' },
      module: { type: 'commonjs' },
    }],
  },
  moduleNameMapper: { '\\.module\\.css$': 'identity-obj-proxy' },
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.ts'],
};
