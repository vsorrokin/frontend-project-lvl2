/* eslint-disable class-methods-use-this */
import _ from 'lodash';
import {
  NESTED,
  CHANGED,
  REMOVED,
  ADDED,
  UNCHANGED,
} from '../flags.js';

class Stylish {
  constructor(config = {}) {
    this.config = {
      ident: 4,
      ...config,
    };
  }

  getObject(value, level = 1) {
    if (typeof value !== 'object' || value === null) return value;

    const lines = [];

    Object.entries(value).forEach(([key, val]) => {
      lines.push(this.getRecord(UNCHANGED, key, val, level));
    });

    return this.wrap(lines, level, this.config.ident);
  }

  getRecord(action, key, value, level) {
    const newLevel = level + 1;

    const valueStr = action === NESTED
      ? this.get(value, newLevel)
      : this.getObject(value, newLevel);

    const actionStr = action === NESTED ? '' : action;

    return this.getRecordString(actionStr, key, valueStr, level, this.config.ident);
  }

  getRecords({
    action,
    key,
    value,
    newValue,
  }, level) {
    if (action === CHANGED) {
      return [
        this.getRecord(REMOVED, key, value, level),
        this.getRecord(ADDED, key, newValue, level),
      ];
    }

    return this.getRecord(action, key, value, level);
  }

  getRecordString(actionStr, key, valueStr, level, ident = 4) {
    const prefix = _.padStart(actionStr, (level * ident) - 1);
    return `${prefix} ${key}: ${valueStr}`;
  }

  wrap(lines, level, ident = 4) {
    const spaces = _.repeat(' ', (level - 1) * ident);
    return `{\n${lines.join('\n')}\n${spaces}}`;
  }

  get(report, level = 1) {
    const lines = report.flatMap((line) => this.getRecords(line, level));

    return this.wrap(lines, level, this.config.ident);
  }
}

export default Stylish;
