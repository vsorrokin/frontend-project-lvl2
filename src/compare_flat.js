/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const UNCHANGED = '';
const REMOVED = '-';
const ADDED = '+';

const stringifyReport = (diffReport) => {
  const lines = diffReport.map(({ action, key, value }) => {
    const prefix = _.padStart(action, 4);
    return `${prefix} ${key}: ${value}`;
  });

  return `{\n${lines.join('\n')}\n}`;
};

const getDiffRow = (action, key, value) => ({ action, key, value });

const readJsonFile = (file) => {
  const content = fs.readFileSync(path.resolve(file), 'utf-8');
  return JSON.parse(content);
};

const getReportForExistingProps = (original, changed) => {
  const diffReport = [];

  // Fill report with props: CHANGED/UNCHANGED/REMOVED
  for (const [originalKey, originalValue] of Object.entries(original)) {
    if (_.has(changed, originalKey)) {
      const changedValue = changed[originalKey];

      if (originalValue === changedValue) {
        diffReport.push(getDiffRow(UNCHANGED, originalKey, originalValue));
      } else {
        // CHANGED
        diffReport.push(getDiffRow(REMOVED, originalKey, originalValue));
        diffReport.push(getDiffRow(ADDED, originalKey, changedValue));
      }
    } else {
      // REMOVED
      diffReport.push(getDiffRow(REMOVED, originalKey, originalValue));
    }
  }

  return diffReport;
};

const getReportForNewProps = (original, changed) => {
  const diffReport = [];

  // Fill report with props: ADDED
  for (const [changedKey, changedValue] of Object.entries(changed)) {
    if (!_.has(original, changedKey)) {
      diffReport.push(getDiffRow(ADDED, changedKey, changedValue));
    }
  }

  return diffReport;
};

export default (file1, file2) => {
  const original = readJsonFile(file1);
  const changed = readJsonFile(file2);

  return stringifyReport([
    ...getReportForExistingProps(original, changed),
    ...getReportForNewProps(original, changed),
  ]);
};
