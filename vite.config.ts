import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@app": "/src/app",
      "@pages": "/src/pages",
      "@entities": "/src/entities",
      "@features": "/src/features",
      "@shared": "/src/shared",
    },
  },
  server: {
    port: 5173,
  },
});
