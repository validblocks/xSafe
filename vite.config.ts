import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  plugins: [
    react(),
    mkcert(),
    eslint({
      exclude: [/virtual:/, /node_modules/],
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: [{ find: 'src', replacement: path.resolve(__dirname, 'src') }],
  },
});
