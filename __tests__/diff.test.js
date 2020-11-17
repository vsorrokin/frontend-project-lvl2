import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import DifferenceCalculator from '../src/diff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

test('getDiff json', async () => {
  const diffCalculator = new DifferenceCalculator();

  const original = getFixturePath('json/deep/1.json');
  const changed = getFixturePath('json/deep/2.json');

  const actual = await diffCalculator.getFilesDiff(original, changed);
  const expected = await readFile('expected/deep_diff.txt');

  expect(actual).toBe(expected);
});

test('getDiff yml-json', async () => {
  const diffCalculator = new DifferenceCalculator();

  const original = getFixturePath('yml/deep/1.yml');
  const changed = getFixturePath('json/deep/2.json');

  const actual = await diffCalculator.getFilesDiff(original, changed);
  const expected = await readFile('expected/deep_diff.txt');

  expect(actual).toBe(expected);
});

test('getDiff yml-json plain', async () => {
  const diffCalculator = new DifferenceCalculator({ formatter: 'plain' });

  const original = getFixturePath('yml/deep/1.yml');
  const changed = getFixturePath('json/deep/2.json');

  const actual = await diffCalculator.getFilesDiff(original, changed);
  const expected = await readFile('expected/deep_diff_plain.txt');

  expect(actual).toBe(expected);
});

test('getDiff yml-json json', async () => {
  const diffCalculator = new DifferenceCalculator({ formatter: 'json' });

  const original = getFixturePath('yml/deep/1.yml');
  const changed = getFixturePath('json/deep/2.json');

  const actual = await diffCalculator.getFilesDiff(original, changed);
  const expected = await readFile('expected/deep_diff_json.txt');

  expect(actual).toBe(expected);
});
