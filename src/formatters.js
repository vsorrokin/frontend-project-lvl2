import _ from 'lodash';

export default {
  stylish: {
    record(actionStr, key, valueStr, level, ident = 4) {
      const prefix = _.padStart(actionStr, (level * ident) - 1);
      return `${prefix} ${key}: ${valueStr}`;
    },

    wrap(lines, level, ident = 4) {
      const spaces = _.repeat(' ', (level - 1) * ident);
      return `{\n${lines.join('\n')}\n${spaces}}`;
    },
  },
};
