import _ from 'lodash';
import getObjFromFile from './get_obj_file.js';
import Stringify from './stringify.js';
import {
  NESTED,
  UNCHANGED,
  CHANGED,
  REMOVED,
  ADDED,
} from './flags.js';

const stringify = new Stringify();

class DifferenceCalculator {
  constructor(config = {}) {
    this.config = config;
  }

  // Get diff record about one property
  // eslint-disable-next-line class-methods-use-this
  getRecord(action, key, value, newValue) {
    return {
      action, key, value, newValue,
    };
  }

  getDiffForExistingProps(original, changed) {
    const diffReport = [];

    Object.entries(original).forEach(([originalKey, originalValue]) => {
      if (_.has(changed, originalKey)) {
        const changedValue = changed[originalKey];

        if (originalValue === changedValue) {
          diffReport.push(this.getRecord(UNCHANGED, originalKey, originalValue));
        } else {
          diffReport.push(this.getRecord(CHANGED, originalKey, originalValue, changedValue));
        }
      } else {
        diffReport.push(this.getRecord(REMOVED, originalKey, originalValue));
      }
    });

    return diffReport;
  }

  getDiffForNewProps(original, changed) {
    const diffReport = [];

    Object.entries(changed).forEach(([changedKey, changedValue]) => {
      if (!_.has(original, changedKey)) {
        diffReport.push(this.getRecord(ADDED, changedKey, changedValue));
      }
    });

    return diffReport;
  }

  getFlatDiff(original, changed) {
    const diffReport = [
      ...this.getDiffForExistingProps(original, changed),
      ...this.getDiffForNewProps(original, changed),
    ];

    diffReport.sort((a, b) => a.key.localeCompare(b.key));

    return diffReport;
  }

  getDeepDiff(original, changed) {
    const diff = this.getFlatDiff(original, changed);

    diff.forEach(({
      key,
      value,
      newValue,
    }, idx) => {
      if (typeof value === 'object' && typeof newValue === 'object') {
        diff[idx] = {
          action: NESTED,
          key,
          value: this.getDeepDiff(value, newValue),
        };
      }
    });

    return diff;
  }

  getFilesDiff(file1, file2) {
    const original = getObjFromFile(file1);
    const changed = getObjFromFile(file2);

    const diff = this.getDeepDiff(original, changed);

    return stringify.get(diff);
  }
}

export default DifferenceCalculator;
