import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import compareFlat from '../src/compare_flat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

test('compareFlat', async () => {
  const original = getFixturePath('compare_flat/1.json');
  const changed = getFixturePath('compare_flat/2.json');

  const actual = await compareFlat(original, changed);
  const expected = await readFile('compare_flat/1_2_diff.txt');

  expect(actual).toBe(expected);
});
