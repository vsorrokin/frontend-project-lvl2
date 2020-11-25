import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import format from './formatters/index.js';
import genDiff from './genDiff.js';

const getExt = (filePath) => path.extname(filePath).substring(1);

const genFilesDiff = (file1Path, file2Path, formatterName = 'stylish') => {
  const file1Content = fs.readFileSync(file1Path, 'utf-8');
  const file2Content = fs.readFileSync(file2Path, 'utf-8');

  const file1Object = parse(file1Content, getExt(file1Path));
  const file2Object = parse(file2Content, getExt(file2Path));

  const diffTree = genDiff(file1Object, file2Object);

  return format(diffTree, formatterName);
};

export default genFilesDiff;
