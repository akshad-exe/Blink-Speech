import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    port: 8080,
    // Note: HTTPS is not required for localhost camera access
    // https: true,
    // Add headers for camera permission
    headers: {
      'Permissions-Policy': 'camera=(self)',
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
