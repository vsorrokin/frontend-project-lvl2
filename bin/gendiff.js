#!/usr/bin/env node
import commander from 'commander';
import getDiff from '../index.js';

const { program } = commander;

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2) => {
    const diff = getDiff(filepath1, filepath2, program.format);
    console.log(diff);
  });

program.parse(process.argv);
