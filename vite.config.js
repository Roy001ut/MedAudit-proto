import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/sql.js/dist/sql-wasm.wasm',
          dest: '',
        },
      ],
    }),
  ],
  optimizeDeps: {
    exclude: ['sql.js'],
  },
  define: {
    'process.env': {},
  },
});
