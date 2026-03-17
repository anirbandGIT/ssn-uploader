import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@repo/types": path.resolve(__dirname, "../types"),
      "@repo/validation": path.resolve(__dirname, "../validation"),
    },
  },
});
