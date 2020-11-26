import _ from 'lodash';
import {
  CHANGED,
  DELETED,
  ADDED,
  UNCHANGED,
  PARENT,
} from '../nodeTypes.js';

const mappings = {
  [ADDED]: '+ ',
  [DELETED]: '- ',
  [UNCHANGED]: '',
  [PARENT]: '',
};

const spacesCount = 4;
const replacer = ' ';

const wrap = (lines, depth) => {
  const indentSize = depth * spacesCount;
  const bracketIndent = replacer.repeat(indentSize - spacesCount);
  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};

const stringifyValue = (value, depth = 1) => {
  const iter = (currentValue, currentDepth) => {
    if (!_.isObject(currentValue)) {
      return String(currentValue);
    }

    const indentSize = currentDepth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `${currentIndent}${key}: ${iter(val, currentDepth + 1)}`);

    return wrap(lines, currentDepth);
  };

  return iter(value, depth);
};

const stringifyNode = (type, key, value, depth) => {
  const typeStr = mappings[type];
  const indentSize = depth * spacesCount;
  const paddedTypeStr = _.padStart(typeStr, indentSize);

  const nodeValue = stringifyValue(value, depth + 1);

  return `${paddedTypeStr}${key}: ${nodeValue}`;
};

const formatStylish = (diffTree) => {
  const iter = (innerTree, depth = 1) => {
    const lines = innerTree
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
      });

    return wrap(lines, depth);
  };

  return iter(diffTree);
};

export default formatStylish;
