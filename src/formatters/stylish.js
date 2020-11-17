/* eslint-disable no-use-before-define */
import _ from 'lodash';
import {
  NESTED,
  CHANGED,
  REMOVED,
  ADDED,
  UNCHANGED,
} from '../flags.js';

const ident = 4;

const wrap = (lines, level) => {
  const spaces = _.repeat(' ', (level - 1) * ident);
  return `{\n${lines.join('\n')}\n${spaces}}`;
};

const getObject = (value, level = 1) => {
  if (!_.isObject(value)) return value;

  const lines = [];

  Object.entries(value).forEach(([key, val]) => {
    lines.push(getRecord(UNCHANGED, key, val, level));
  });

  return wrap(lines, level);
};

const getRecordString = (actionStr, key, valueStr, level) => {
  const prefix = _.padStart(actionStr, (level * ident) - 1);
  return `${prefix} ${key}: ${valueStr}`;
};

const getRecord = (action, key, value, level) => {
  const newLevel = level + 1;

  const valueStr = action === NESTED
    ? stylish(value, newLevel)
    : getObject(value, newLevel);

  const actionStr = action === NESTED ? '' : action;

  return getRecordString(actionStr, key, valueStr, level);
};

const getRecords = ({
  action,
  key,
  value,
  newValue,
}, level) => {
  if (action === CHANGED) {
    return [
      getRecord(REMOVED, key, value, level),
      getRecord(ADDED, key, newValue, level),
    ];
  }

  return getRecord(action, key, value, level);
};

const stylish = (report, level = 1) => {
  const lines = report.flatMap((line) => getRecords(line, level));

  return wrap(lines, level);
};

export default stylish;
