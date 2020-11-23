/* eslint-disable no-use-before-define */
import _ from 'lodash';
import {
  CHANGED,
  REMOVED,
  ADDED,
  UNCHANGED,
  NESTED,
} from '../diffTypes.js';

const mappings = {
  [ADDED]: '+',
  [REMOVED]: '-',
  [UNCHANGED]: '',
  [NESTED]: '',
};

const ident = 4;

const wrap = (lines, level) => {
  const spaces = _.repeat(' ', (level - 1) * ident);
  return `{\n${lines.join('\n')}\n${spaces}}`;
};

const getObject = (value, level = 1) => {
  if (!_.isObject(value)) return value;

  const lines = Object.entries(value).map(([key, val]) => getRecord({
    type: UNCHANGED,
    key,
    value: val,
  }, level));

  return wrap(lines, level);
};

const getRecordString = (typeStr, key, valueStr, level) => {
  const prefix = _.padStart(typeStr, (level * ident) - 1);
  return `${prefix} ${key}: ${valueStr}`;
};

const getRecord = ({
  type,
  key,
  value,
  children,
}, level) => {
  const newLevel = level + 1;

  const valueStr = type === NESTED
    ? stylish(children, newLevel)
    : getObject(value, newLevel);

  const typeStr = mappings[type];

  return getRecordString(typeStr, key, valueStr, level);
};

const getRecords = ({
  type,
  key,
  children,
  value,
  newValue,
}, level) => {
  if (type === CHANGED) {
    return [
      getRecord({
        type: REMOVED,
        key,
        value,
      }, level),
      getRecord({
        type: ADDED,
        key,
        value: newValue,
      }, level),
    ];
  }

  return getRecord({
    type,
    key,
    value,
    children,
  }, level);
};

const stylish = (report, level = 1) => {
  const lines = report.flatMap((line) => getRecords(line, level));

  return wrap(lines, level);
};

export default stylish;
