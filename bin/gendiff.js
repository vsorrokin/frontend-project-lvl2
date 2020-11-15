#!/usr/bin/env node
import { program } from 'commander';
import DifferenceCalculator from '../src/diff.js';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action(async (filepath1, filepath2) => {
    const diffCalculator = new DifferenceCalculator();
    const diff = await diffCalculator.getFilesDiff(filepath1, filepath2);
    console.log(diff);
  });

program.parse(process.argv);
