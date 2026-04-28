import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, 'apps', 'main-app', 'dist');
const experimentDir = path.join(rootDir, 'docs', 'experiment-results');
const outputDir = path.join(rootDir, 'out');

rmSync(outputDir, { force: true, recursive: true });
mkdirSync(outputDir, { recursive: true });
cpSync(sourceDir, outputDir, { recursive: true });

if (existsSync(experimentDir)) {
  cpSync(experimentDir, path.join(outputDir, 'experiment-results'), { recursive: true });
}

copyFileSync(path.join(outputDir, 'index.html'), path.join(outputDir, '404.html'));

console.log(`Pages artifact prepared at ${path.relative(rootDir, outputDir)}`);
