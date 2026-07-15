import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  envPrefix: "REACT_APP_",
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@features": path.resolve(__dirname, "src/features"),
      "@shared": path.resolve(__dirname, "src/features/shared"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
  plugins: [react()],
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
    host: true,
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: {
        ".js": "jsx",
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.js"],
  },
});
