import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import getDiff from '../src/diff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

test('getDiff json', async () => {
  const original = getFixturePath('json/simple/1.json');
  const changed = getFixturePath('json/simple/2.json');

  const actual = await getDiff(original, changed);
  const expected = await readFile('expected/1_2_diff.txt');

  expect(actual).toBe(expected);
});

test('getDiff yml', async () => {
  const original = getFixturePath('yml/simple/1.yml');
  const changed = getFixturePath('yml/simple/2.yml');

  const actual = await getDiff(original, changed);
  const expected = await readFile('expected/1_2_diff.txt');

  expect(actual).toBe(expected);
});

test('getDiff json-yml', async () => {
  const original = getFixturePath('yml/simple/1.yml');
  const changed = getFixturePath('json/simple/2.json');

  const actual = await getDiff(original, changed);
  const expected = await readFile('expected/1_2_diff.txt');

  expect(actual).toBe(expected);
});
