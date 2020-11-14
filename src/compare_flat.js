/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import _ from 'lodash';

const UNCHANGED = '';
const CHANGED = '-+';
const REMOVED = '-';
const ADDED = '+';

const getDiffRow = (action, key, value, newValue) => ({
  action, key, value, newValue,
});

// Transform CHANGED record into two records: REMOVED + ADDED
const transformChangedRecord = (line) => {
  if (line.action === CHANGED) {
    return [
      getDiffRow(REMOVED, line.key, line.value),
      getDiffRow(ADDED, line.key, line.newValue),
    ];
  }

  return line;
};

const stringifyReport = (diffReport) => {
  const lines = diffReport.flatMap(transformChangedRecord).map(({ action, key, value }) => {
    const prefix = _.padStart(action, 4);
    return `${prefix} ${key}: ${value}`;
  });

  return `{\n${lines.join('\n')}\n}`;
};

const readJsonFile = (file) => {
  const content = fs.readFileSync(file, 'utf-8');
  return JSON.parse(content);
};

const getReportForExistingProps = (original, changed) => {
  const diffReport = [];

  for (const [originalKey, originalValue] of Object.entries(original)) {
    if (_.has(changed, originalKey)) {
      const changedValue = changed[originalKey];

      if (originalValue === changedValue) {
        diffReport.push(getDiffRow(UNCHANGED, originalKey, originalValue));
      } else {
        diffReport.push(getDiffRow(CHANGED, originalKey, originalValue, changedValue));
      }
    } else {
      diffReport.push(getDiffRow(REMOVED, originalKey, originalValue));
    }
  }

  return diffReport;
};

const getReportForNewProps = (original, changed) => {
  const diffReport = [];

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

  const diffReport = [
    ...getReportForExistingProps(original, changed),
    ...getReportForNewProps(original, changed),
  ];

  diffReport.sort((a, b) => a.key.localeCompare(b.key));

  return stringifyReport(diffReport);
};
