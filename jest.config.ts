/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",

  roots: ["<rootDir>/src"],

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@/assets/images/.*\\.(png|jpg|jpeg|gif|webp)$":
      "<rootDir>/src/shared/__mocks__/assetsMock.ts",
    "\\.svg$": "<rootDir>/src/shared/__mocks__/svgMock.ts",
    "\\.(css|scss)$": "identity-obj-proxy",
  },

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { useESM: true, tsconfig: "<rootDir>/tsconfig.app.json" },
    ],
  },

  extensionsToTreatAsEsm: [".ts", ".tsx"],

  transformIgnorePatterns: ["node_modules/(?!.*\\.json$)"],

  testTimeout: 10000,
};
