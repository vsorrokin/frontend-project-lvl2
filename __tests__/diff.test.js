import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import getDiff from '../src/diff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('getDiff json', () => {
  const original = getFixturePath('json/deep/1.json');
  const changed = getFixturePath('json/deep/2.json');

  const actual = getDiff(original, changed);
  const expected = readFile('expected/deep_diff.txt');

  expect(actual).toBe(expected);
});

test('getDiff yml-json', () => {
  const original = getFixturePath('yml/deep/1.yml');
  const changed = getFixturePath('json/deep/2.json');

  const actual = getDiff(original, changed);
  const expected = readFile('expected/deep_diff.txt');

  expect(actual).toBe(expected);
});

test('getDiff yml-json plain', () => {
  const original = getFixturePath('yml/deep/1.yml');
  const changed = getFixturePath('json/deep/2.json');

  const actual = getDiff(original, changed, { formatter: 'plain' });
  const expected = readFile('expected/deep_diff_plain.txt');

  expect(actual).toBe(expected);
});

test('getDiff yml-json json', () => {
  const original = getFixturePath('yml/deep/1.yml');
  const changed = getFixturePath('json/deep/2.json');

  const actual = getDiff(original, changed, { formatter: 'json' });
  const expected = readFile('expected/deep_diff_json.txt');

  expect(actual).toBe(expected);
});
