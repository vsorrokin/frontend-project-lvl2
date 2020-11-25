import _ from 'lodash';

import {
  UNCHANGED,
  CHANGED,
  DELETED,
  ADDED,
  PARENT,
} from './nodeTypes.js';

const buildNode = (type, key, value, newValue) => {
  if (type === PARENT) {
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

  return keys.map((key) => {
    const originalValue = original[key];
    const changedValue = changed[key];

    if (_.has(original, key) && !_.has(changed, key)) {
      return buildNode(DELETED, key, originalValue);
    }

    if (_.has(changed, key) && !_.has(original, key)) {
      return buildNode(ADDED, key, changedValue);
    }

    if (originalValue === changedValue) {
      return buildNode(UNCHANGED, key, originalValue);
    }

    if (_.isObject(originalValue) && _.isObject(changedValue)) {
      const children = genDiff(originalValue, changedValue);
      return buildNode(PARENT, key, children);
    }

    return buildNode(CHANGED, key, originalValue, changedValue);
  });
};

export default genDiff;
