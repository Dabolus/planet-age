import { promises as fs } from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { minifyHtml, injectHtml } from 'vite-plugin-html';
import yaml from './plugins/yaml';
import { load } from 'js-yaml';

export default defineConfig(async () => ({
  plugins: [
    yaml(),
    minifyHtml(),
    injectHtml({
      injectData: {
        planets: load(
          await fs.readFile(
            path.join(__dirname, 'src/data/planets.yml'),
            'utf8',
          ),
        ),
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
}));
