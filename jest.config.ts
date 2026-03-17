import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  testMatch: ["**/tests/**/*.test.ts"],

  moduleFileExtensions: ["ts", "js"],

  transform: {
    "^.+\\.ts$": "ts-jest"
  },

  verbose: true,

  // 🔥 evita qualquer output físico
  cache: false
};

export default config;