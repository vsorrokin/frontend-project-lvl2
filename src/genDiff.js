import _ from 'lodash';

import {
  UNCHANGED,
  CHANGED,
  DELETED,
  ADDED,
  NESTED,
} from './diffTypes.js';

const getRecord = (type, key, value, newValue) => {
  if (type === NESTED) {
    return {
      type, key, children: value,
    };
  }
  return {
    type, key, value, newValue,
  };
};

const genDiff = (original, changed) => {
  const keys = _.sortBy(_.keys({ ...original, ...changed }));

  return keys.reduce((acc, key) => {
    const originalValue = original[key];
    const changedValue = changed[key];

    if (_.has(original, key) && !_.has(changed, key)) {
      return [...acc, getRecord(DELETED, key, originalValue)];
    }

    if (_.has(changed, key) && !_.has(original, key)) {
      return [...acc, getRecord(ADDED, key, changedValue)];
    }

    if (originalValue === changedValue) {
      return [...acc, getRecord(UNCHANGED, key, originalValue)];
    }

    if (_.isObject(originalValue) && _.isObject(changedValue)) {
      const children = genDiff(originalValue, changedValue);
      return [...acc, getRecord(NESTED, key, children)];
    }

    return [...acc, getRecord(CHANGED, key, originalValue, changedValue)];
  }, []);
};

export default genDiff;
