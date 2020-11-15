import yaml from 'js-yaml';

export default {
  json: (data) => JSON.parse(data),
  yml: (data) => yaml.safeLoad(data),
};
