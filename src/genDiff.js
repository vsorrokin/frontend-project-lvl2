import _ from 'lodash';

import {
  UNCHANGED,
  CHANGED,
  REMOVED,
  ADDED,
  NESTED,
} from './diffTypes.js';

const getRecord = (type, key, value, newValue) => ({
  type, key, value, newValue,
});

const getDiffForExistingProps = (original, changed) => Object.entries(original)
  .reduce((acc, [originalKey, originalValue]) => {
    if (_.has(changed, originalKey)) {
      const changedValue = changed[originalKey];

      if (originalValue === changedValue) {
        return [...acc, getRecord(UNCHANGED, originalKey, originalValue)];
      }

      return [...acc, getRecord(CHANGED, originalKey, originalValue, changedValue)];
    }

    return [...acc, getRecord(REMOVED, originalKey, originalValue)];
  }, []);

const getDiffForNewProps = (original, changed) => Object.entries(changed)
  .reduce((acc, [changedKey, changedValue]) => {
    if (!_.has(original, changedKey)) {
      return [...acc, getRecord(ADDED, changedKey, changedValue)];
    }

    return acc;
  }, []);

const getFlatDiff = (original, changed) => {
  const diffReport = [
    ...getDiffForExistingProps(original, changed),
    ...getDiffForNewProps(original, changed),
  ];

  return _.sortBy(diffReport, 'key');
};

const getDeepDiff = (original, changed) => getFlatDiff(original, changed).map((diff) => {
  const {
    key,
    value,
    newValue,
  } = diff;

  if (_.isObject(value) && _.isObject(newValue)) {
    return {
      type: NESTED,
      key,
      children: getDeepDiff(value, newValue),
    };
  }

  return diff;
});

export default getDeepDiff;
