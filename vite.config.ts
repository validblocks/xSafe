import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  plugins: [react(), mkcert(), eslint()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: [{ find: 'src', replacement: path.resolve(__dirname, 'src') }],
  },
});
