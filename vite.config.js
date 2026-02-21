import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

const gitHash = execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    __GIT_HASH__: JSON.stringify(gitHash),
  },
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
  },
});
