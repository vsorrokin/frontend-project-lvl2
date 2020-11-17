import _ from 'lodash';
import getObjFromFile from './get_obj_file.js';
import stringify from './stringify.js';
import {
  NESTED,
  UNCHANGED,
  CHANGED,
  REMOVED,
  ADDED,
} from './flags.js';

const getRecord = (action, key, value, newValue) => ({
  action, key, value, newValue,
});

const getDiffForExistingProps = (original, changed) => {
  const diffReport = [];

  Object.entries(original).forEach(([originalKey, originalValue]) => {
    if (_.has(changed, originalKey)) {
      const changedValue = changed[originalKey];

      if (originalValue === changedValue) {
        diffReport.push(getRecord(UNCHANGED, originalKey, originalValue));
      } else {
        diffReport.push(getRecord(CHANGED, originalKey, originalValue, changedValue));
      }
    } else {
      diffReport.push(getRecord(REMOVED, originalKey, originalValue));
    }
  });

  return diffReport;
};

const getDiffForNewProps = (original, changed) => {
  const diffReport = [];

  Object.entries(changed).forEach(([changedKey, changedValue]) => {
    if (!_.has(original, changedKey)) {
      diffReport.push(getRecord(ADDED, changedKey, changedValue));
    }
  });

  return diffReport;
};

const getFlatDiff = (original, changed) => {
  const diffReport = [
    ...getDiffForExistingProps(original, changed),
    ...getDiffForNewProps(original, changed),
  ];

  diffReport.sort((a, b) => a.key.localeCompare(b.key));

  return diffReport;
};

const getDeepDiff = (original, changed) => {
  const diff = getFlatDiff(original, changed);

  diff.forEach(({
    key,
    value,
    newValue,
  }, idx) => {
    if (typeof value === 'object' && typeof newValue === 'object') {
      diff[idx] = {
        action: NESTED,
        key,
        value: getDeepDiff(value, newValue),
      };
    }
  });

  return diff;
};

const getFilesDiff = (file1, file2, config = {}) => {
  const original = getObjFromFile(file1);
  const changed = getObjFromFile(file2);

  const diff = getDeepDiff(original, changed);

  return stringify(diff, config);
};

export default getFilesDiff;
