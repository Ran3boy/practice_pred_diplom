import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: {
  env: Record<string, string | undefined>;
};

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/';

export default defineConfig({
  base,
  plugins: [react()]
});
