import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'node:events': 'events',
      'node:http': 'stream-http',
      'node:https': 'https-browserify',
      'node:stream': 'stream-browserify',
      'node:buffer': 'buffer',
      'node:util': 'util'
    }
  },
  optimizeDeps: {
    exclude: ['https-proxy-agent', 'agent-base'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});