import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isBuild = command === 'build';
  const isProduction = mode === 'production';

  return {
    base: env.APP_BASE_PATH || '/',
    plugins: [
      react(),
      {
        name: 'cache-versioned-pokemon-artwork-in-preview',
        configurePreviewServer(server) {
          server.middlewares.use((request, response, next) => {
            if (/\/pokemon-artwork\/v1\/(?:card-(?:160|256)\/)?\d+\.webp(?:\?|$)/.test(request.url ?? '')) {
              response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
            next();
          });
        },
      },
      ...(isBuild && isProduction ? [viteCompression({ verbose: false })] : []),
      ...(isBuild && env.ANALYZE === 'true'
        ? [
            visualizer({
              open: false,
              emitFile: true,
              filename: 'bundle-report.html',
              template: 'treemap',
              gzipSize: true,
            }) as PluginOption,
            visualizer({
              open: false,
              emitFile: true,
              filename: 'bundle-report-list.html',
              template: 'list',
              gzipSize: true,
            }) as PluginOption,
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 9000,
      open: true,
    },
    preview: {
      port: 9002,
    },
    build: {
      sourcemap: isProduction ? false : mode === 'stage' ? 'hidden' : true,
      minify: isProduction ? 'oxc' : false,
      cssMinify: isProduction,
      cssCodeSplit: true,
      rolldownOptions: {
        output: {
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
          codeSplitting: {
            groups: [
              {
                name: 'react-vendor',
                test: /node_modules[\\/](?:react(?:-dom)?|scheduler)[\\/]/,
                priority: 20,
              },
              {
                name: 'state-vendor',
                test: /node_modules[\\/](?:@reduxjs[\\/]toolkit|react-redux|redux|redux-thunk|immer|reselect)[\\/]/,
                priority: 10,
              },
            ],
          },
        },
      },
    },
  };
});
