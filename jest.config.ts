import type { Config } from "jest";

const config: Config = {
  transform: { "^.+\\.ts?$": "ts-jest" },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testRegex: ".*\\.(test|spec)?\\.(ts)$",
  testTimeout: 10000,
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  collectCoverageFrom: ["**/*.ts", "!**/node_moduels/**"],
  testEnvironment: "node",
  rootDir: "src/",
  restoreMocks: true,
  clearMocks: true,
  resetMocks: true,
  maxWorkers: "50%",
  setupFiles: ["./tests/config/setup-tests.ts"],
  reporters: [
    "default",
    ["../node_modules/jest-html-reporter", { pageTitle: "Test Report" }],
  ],
};

export default config;
