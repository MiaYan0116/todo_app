export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    globals: {
      "ts-jest": {
        tsconfig: "<rootDir>/tsconfig.json", 
      },
    },
  };
  