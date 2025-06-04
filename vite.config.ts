import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      'https-proxy-agent': 'data:text/javascript,export class HttpsProxyAgent {}',
      'agent-base': 'data:text/javascript,export class Agent {}',
      'proxy-agent': 'data:text/javascript,export class ProxyAgent {}',
      'http-proxy-agent': 'data:text/javascript,export class HttpProxyAgent {}'
    }
  }
});