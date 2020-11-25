/* eslint-disable no-use-before-define */
import _ from 'lodash';
import {
  CHANGED,
  DELETED,
  ADDED,
  UNCHANGED,
  PARENT,
} from '../nodeTypes.js';

const mappings = {
  [ADDED]: '+',
  [DELETED]: '-',
  [UNCHANGED]: '',
  [PARENT]: '',
};

const ident = 4;

const wrap = (lines, depth) => {
  const spaces = _.repeat(' ', depth * ident);
  return `{\n${lines.join('\n')}\n${spaces}}`;
};

const stringifyValue = (value, depth = 1) => {
  if (!_.isObject(value)) return value;

  return wrap(Object.entries(value).map(([key, val]) => {
    const spaces = _.repeat(' ', depth * ident);
    const v = _.isObject(val) ? stringifyValue(val, depth + 1) : val;
    return `${spaces}${key}: ${v}`;
  }), depth - 1);
};

const stringifyNode = (type, key, value, depth) => {
  const typeStr = mappings[type];
  const identDepth = depth * ident - 1;
  const paddedTypeStr = _.padStart(typeStr, identDepth);
  const nodeValue = stringifyValue(value, depth + 1);
  return `${paddedTypeStr} ${key}: ${nodeValue}`;
};

const stylish = (diffTree) => {
  const iter = (innerTree, depth = 1) => wrap(innerTree
    .flatMap(({
      type,
      key,
      value,
      children,
      newValue,
    }) => {
      switch (type) {
        case DELETED:
        case ADDED:
        case UNCHANGED:
          return stringifyNode(type, key, value, depth);
        case CHANGED:
          return [
            stringifyNode(DELETED, key, value, depth),
            stringifyNode(ADDED, key, newValue, depth),
          ];
        case PARENT:
          return stringifyNode(type, key, iter(children, depth + 1), depth);
        default:
          throw new Error(`Unknown node type: '${type}'!`);
      }
    }), depth - 1);

  return iter(diffTree);
};

export default stylish;
