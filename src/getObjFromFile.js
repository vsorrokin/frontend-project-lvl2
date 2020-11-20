import fs from 'fs';
import path from 'path';
import parsers from './parsers.js';

const getObjFromFile = (file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const ext = path.extname(file).substring(1);
  return parsers[ext](content);
};

export default getObjFromFile;
