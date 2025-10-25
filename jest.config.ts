/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  roots: ["<rootDir>/src"],

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Алиасы
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // ESM support, если используешь "type": "module" в package.json
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "<rootDir>/tsconfig.app.json",
    },
  },

  // Чтобы корректно обрабатывались импорты json
  transformIgnorePatterns: ["node_modules/(?!.*\\.json$)"],
};
