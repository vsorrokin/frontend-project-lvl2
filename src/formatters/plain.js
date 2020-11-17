import _ from 'lodash';
import {
  NESTED,
  CHANGED,
  REMOVED,
  ADDED,
  UNCHANGED,
} from '../flags.js';

const getValueString = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  return typeof value === 'string' ? `'${value}'` : value;
};

const getRecordString = (action, key, value, newValue) => {
  const valueStr = getValueString(value);
  const newValueStr = getValueString(newValue);

  switch (action) {
    case REMOVED:
      return `Property '${key}' was removed`;
    case ADDED:
      return `Property '${key}' was added with value: ${valueStr}`;
    case CHANGED:
      return `Property '${key}' was updated. From ${valueStr} to ${newValueStr}`;
    default:
      throw new Error(`Unknown action: '${action}'!`);
  }
};

const plain = (report, props = []) => report
  .filter((line) => line.action !== UNCHANGED)
  .flatMap((line) => {
    const {
      action,
      key,
      value,
      newValue,
    } = line;

    if (action === NESTED) {
      return plain(value, [...props, key]);
    }

    const keyPath = [...props, key].join('.');

    return getRecordString(action, keyPath, value, newValue);
  }).join('\n');

export default plain;
