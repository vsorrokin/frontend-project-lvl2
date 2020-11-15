import formatters from './formatters';
import {
  NESTED,
  CHANGED,
  REMOVED,
  ADDED,
  UNCHANGED,
} from './flags.js';

class Stringify {
  constructor() {
    this.ident = 4;
    this.formatter = formatters.stylish;
  }

  getValue(value, level = 1) {
    if (typeof value !== 'object' || value === null) return value;

    const lines = [];

    Object.entries(value).forEach(([key, val]) => {
      lines.push(this.getRecord(UNCHANGED, key, val, level));
    });

    return this.formatter.wrap(lines, level, this.ident);
  }

  getRecord(action, key, value, level) {
    const newLevel = level + 1;

    const valueStr = action === NESTED
      ? this.get(value, newLevel)
      : this.getValue(value, newLevel);

    const actionStr = action === NESTED ? '' : action;

    return this.formatter.record(actionStr, key, valueStr, level, this.ident);
  }

  get(report, level = 1) {
    const lines = report.flatMap(({
      action,
      key,
      value,
      newValue,
    }) => {
      if (action === CHANGED) {
        return [
          this.getRecord(REMOVED, key, value, level),
          this.getRecord(ADDED, key, newValue, level),
        ];
      }

      return this.getRecord(action, key, value, level);
    });

    return this.formatter.wrap(lines, level, this.ident);
  }
}

export default Stringify;
