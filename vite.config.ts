import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile";
import fs from "fs"; // Using ESM-compatible import

// Get the repository name from the environment variable or fallback
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'ride-text-connect';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${repoName}/` : '/', // Use '/' for local preview
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    viteSingleFile(),
    {
      name: 'copy-404',
      closeBundle() {
        const indexPath = path.resolve(__dirname, 'dist/index.html');
        const notFoundPath = path.resolve(__dirname, 'dist/404.html');
        fs.copyFileSync(indexPath, notFoundPath); // ESM-compatible imports
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
}));