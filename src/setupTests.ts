import "@testing-library/jest-dom";

// Mock Vite env vars
Object.defineProperty(globalThis, "importMeta", {
  value: {
    env: {
      VITE_BASENAME: "/",
      VITE_API_URL: "http://localhost:3001",
    },
  },
});
