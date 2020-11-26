import _ from 'lodash';
import {
  CHANGED,
  DELETED,
  ADDED,
  UNCHANGED,
  PARENT,
} from '../nodeTypes.js';

const stringifyValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  return _.isString(value) ? `'${value}'` : value;
};

const formatPlain = (tree) => {
  const iter = (innerTree, nodePath = []) => innerTree
    .flatMap(({
      type,
      key,
      value,
      children,
      newValue,
    }) => {
      const nodePathStr = [...nodePath, key].join('.');

      switch (type) {
        case DELETED:
          return `Property '${nodePathStr}' was removed`;
        case ADDED:
          return `Property '${nodePathStr}' was added with value: ${stringifyValue(value)}`;
        case CHANGED:
          return `Property '${nodePathStr}' was updated. From ${stringifyValue(value)} to ${stringifyValue(newValue)}`;
        case UNCHANGED:
          return null;
        case PARENT:
          return iter(children, [...nodePath, key]);
        default:
          throw new Error(`Unknown node type: '${type}'!`);
      }
    }).filter((s) => s);

  return iter(tree);
};

const toString = (lines) => lines.join('\n');

const stringify = (tree) => toString(formatPlain(tree));

export default stringify;
