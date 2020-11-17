import formatters from './formatters/index.js';

const stringify = (report, config = {}) => {
  const format = formatters[config.formatter || 'stylish'];
  return format(report);
};

export default stringify;
