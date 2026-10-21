import { defineConfig } from 'vite';
import fetchUrl from './api/fetch-url.js';

const fetchUrlApi = {
  name: 'fetch-url-api',
  configureServer(server) {
    server.middlewares.use('/api/fetch-url', fetchUrl);
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api/fetch-url', fetchUrl);
  },
};

export default defineConfig({
  plugins: [fetchUrlApi],
});
