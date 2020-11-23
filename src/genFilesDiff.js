import fs from 'fs';
import path from 'path';
import parsers from './parsers.js';
import formatters from './formatters/index.js';
import genDiff from './genDiff.js';

const parse = (content, filePath) => {
  const ext = path.extname(filePath).substring(1);
  return parsers[ext](content);
};

const format = (diff, formatterName) => {
  const formatter = formatters[formatterName || 'stylish'];
  return formatter(diff);
};

const genFilesDiff = (file1Path, file2Path, formatterName) => {
  const file1Content = fs.readFileSync(file1Path, 'utf-8');
  const file2Content = fs.readFileSync(file2Path, 'utf-8');

  const file1Object = parse(file1Content, file1Path);
  const file2Object = parse(file2Content, file2Path);

  const diff = genDiff(file1Object, file2Object);

  return format(diff, formatterName);
};

export default genFilesDiff;
