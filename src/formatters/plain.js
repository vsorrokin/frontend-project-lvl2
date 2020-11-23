import _ from 'lodash';
import {
  CHANGED,
  REMOVED,
  ADDED,
  UNCHANGED,
  NESTED,
} from '../diffTypes.js';

const getValueString = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  return typeof value === 'string' ? `'${value}'` : value;
};

const getRecordString = (type, key, value, newValue) => {
  const valueStr = getValueString(value);
  const newValueStr = getValueString(newValue);

  switch (type) {
    case REMOVED:
      return `Property '${key}' was removed`;
    case ADDED:
      return `Property '${key}' was added with value: ${valueStr}`;
    case CHANGED:
      return `Property '${key}' was updated. From ${valueStr} to ${newValueStr}`;
    default:
      throw new Error(`Unknown action: '${type}'!`);
  }
};

const plain = (report, props = []) => report
  .filter((line) => line.type !== UNCHANGED)
  .flatMap((line) => {
    const {
      type,
      key,
      value,
      children,
      newValue,
    } = line;

    if (type === NESTED) {
      return plain(children, [...props, key]);
    }

    const keyPath = [...props, key].join('.');

    return getRecordString(type, keyPath, value, newValue);
  }).join('\n');

export default plain;
