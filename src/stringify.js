import formatters from './formatters/index.js';

const stringify = (report, formatter) => {
  const format = formatters[formatter || 'stylish'];
  return format(report);
};

export default stringify;
