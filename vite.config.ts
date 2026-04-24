import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

function getPortFromUrl(value?: string) {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.port ? Number(url.port) : undefined;
  } catch {
    return undefined;
  }
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const appPort = getPortFromUrl(env.APP_URL) ?? 3002;

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: appPort,
      strictPort: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
