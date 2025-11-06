import "@testing-library/jest-dom";

// --- MOCK VITE ENV ---
(globalThis as any).importMeta = {
  env: {
    VITE_API_URL: "http://localhost:3001",
    VITE_BASENAME: "/",
    VITE_APP_NAME: "FinTrack-Test",
  },
};

// --- NODE POLYFILLS ---
import { TextEncoder, TextDecoder } from "util";
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;
