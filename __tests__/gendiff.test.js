import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const gendiff = (args, cwd) => new Promise((resolve) => {
  exec(`npx --no-install gendiff ${args.join(' ')}`, { cwd }, (error, stdout, stderr) => {
    resolve({
      code: error && error.code ? error.code : 0,
      error,
      stdout,
      stderr,
    });
  });
});

test('gendiff stylish', async () => {
  const params = [
    '__fixtures__/json/deep/1.json',
    '__fixtures__/json/deep/2.json',
  ];

  const { stdout: actual } = await gendiff(params, '.');

  const expected = readFile('expected/deep_diff.txt');

  expect(actual.trim()).toBe(expected);
});

test('gendiff plain', async () => {
  const params = [
    '__fixtures__/json/deep/1.json',
    '__fixtures__/yml/deep/2.yml',
    '-f',
    'plain',
  ];

  const { stdout: actual } = await gendiff(params, '.');

  const expected = readFile('expected/deep_diff_plain.txt');

  expect(actual.trim()).toBe(expected);
});

test('gendiff json', async () => {
  const params = [
    '__fixtures__/json/deep/1.json',
    '__fixtures__/yml/deep/2.yml',
    '-f',
    'json',
  ];

  const { stdout: actual } = await gendiff(params, '.');

  const expected = readFile('expected/deep_diff_json.txt');

  expect(actual.trim()).toBe(expected);
});
