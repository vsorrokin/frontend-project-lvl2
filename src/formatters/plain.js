/* eslint-disable class-methods-use-this */
import _ from 'lodash';
import {
  NESTED,
  CHANGED,
  REMOVED,
  ADDED,
  UNCHANGED,
} from '../flags.js';

class Plain {
  constructor(config = {}) {
    this.config = {
      ...config,
    };
  }

  getValueString(value) {
    if (_.isObject(value)) {
      return '[complex value]';
    }

    return typeof value === 'string' ? `'${value}'` : value;
  }

  getRecordString(action, key, value, newValue) {
    const valueStr = this.getValueString(value);
    const newValueStr = this.getValueString(newValue);

    switch (action) {
      case REMOVED:
        return `Property '${key}' was removed`;
      case ADDED:
        return `Property '${key}' was added with value: ${valueStr}`;
      case CHANGED:
        return `Property '${key}' was updated. From ${valueStr} to ${newValueStr}`;
      default:
        break;
    }

    return '';
  }

  get(report, props = []) {
    const lines = report
      .filter((line) => line.action !== UNCHANGED)
      .flatMap((line) => {
        const {
          action,
          key,
          value,
          newValue,
        } = line;

        if (action === NESTED) {
          return this.get(value, [...props, key]);
        }

        const keyPath = [...props, key].join('.');

        return this.getRecordString(action, keyPath, value, newValue);
      });

    return lines.join('\n');
  }
}

export default Plain;
