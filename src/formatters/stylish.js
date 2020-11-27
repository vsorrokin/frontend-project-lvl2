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
  [CHANGED]: '',
};

const spacesCount = 4;
const replacer = ' ';

const stringifyValue = (value, depth = 1) => {
  const iter = (currentValue, currentDepth) => {
    if (!_.isObject(currentValue)) {
      return String(currentValue);
    }

    const indentSize = currentDepth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);

    const lines = Object
      .entries(currentValue)
      .map(([key, val]) => `${currentIndent}${key}: ${iter(val, currentDepth + 1)}`);

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(value, depth);
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
        const prefix = mappings[type];
        const indentSize = depth * spacesCount - prefix.length;
        const currentIndent = replacer.repeat(indentSize);
        const nodeValue = stringifyValue(value, depth + 1);

        switch (type) {
          case DELETED:
          case ADDED:
          case UNCHANGED:
            return `${currentIndent}${prefix}${key}: ${nodeValue}`;
          case CHANGED: {
            const prefixDeleted = mappings[DELETED];
            const indentDeletedSize = depth * spacesCount - prefixDeleted.length;
            const deletedIndent = replacer.repeat(indentDeletedSize);
            const nodeDeletedValue = stringifyValue(value, depth + 1);

            const prefixAdded = mappings[ADDED];
            const indentAddedSize = depth * spacesCount - prefixAdded.length;
            const addedIndent = replacer.repeat(indentAddedSize);
            const nodeAddedValue = stringifyValue(newValue, depth + 1);

            return [
              `${deletedIndent}${prefixDeleted}${key}: ${nodeDeletedValue}`,
              `${addedIndent}${prefixAdded}${key}: ${nodeAddedValue}`,
            ];
          }
          case PARENT: {
            return `${currentIndent}${key}: ${iter(children, depth + 1)}`;
          }
          default:
            throw new Error(`Unknown node type: '${type}'!`);
        }
      });

    const indentSize = depth * spacesCount;
    const bracketIndent = replacer.repeat(indentSize - spacesCount);

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(diffTree);
};

export default formatStylish;
