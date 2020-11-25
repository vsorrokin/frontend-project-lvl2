import yaml from 'js-yaml';

const parsers = {
  json: (data) => JSON.parse(data),
  yml: (data) => yaml.safeLoad(data),
};

const parse = (data, format) => parsers[format](data);

export default parse;
