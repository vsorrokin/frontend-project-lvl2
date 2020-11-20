import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const FILE1_PATH_JSON = getFixturePath('file1.json');
const FILE2_PATH_JSON = getFixturePath('file2.json');

const FILE1_PATH_YAML = getFixturePath('file1.yml');
const FILE2_PATH_YAML = getFixturePath('file2.yml');

const EXPECTED_JSON = readFile('expected.json');
const EXPECTED_PLAIN = readFile('expected.plain');
const EXPECTED_STYLISH = readFile('expected.stylish');

test('genDiff json stylish', () => {
  const actual = genDiff(FILE1_PATH_JSON, FILE2_PATH_JSON, 'stylish');
  expect(actual).toBe(EXPECTED_STYLISH);

  const actualDefaultFormat = genDiff(FILE1_PATH_JSON, FILE2_PATH_JSON);
  expect(actualDefaultFormat).toBe(EXPECTED_STYLISH);
});

test('genDiff yml stylish', () => {
  const actual = genDiff(FILE1_PATH_YAML, FILE2_PATH_YAML, 'stylish');
  expect(actual).toBe(EXPECTED_STYLISH);
});

test('genDiff yml-json plain', () => {
  const actual = genDiff(FILE1_PATH_JSON, FILE2_PATH_YAML, 'plain');
  expect(actual).toBe(EXPECTED_PLAIN);
});

test('genDiff yml-json json', () => {
  const actual = genDiff(FILE1_PATH_JSON, FILE2_PATH_YAML, 'json');
  expect(actual).toBe(EXPECTED_JSON);
});
