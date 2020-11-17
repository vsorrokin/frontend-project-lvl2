import formatters from './formatters/index.js';

class Stringify {
  constructor(config = {}) {
    this.config = {
      formatter: 'stylish',
      ident: 4,
      ...config,
    };

    this.formatter = new formatters[this.config.formatter]({
      ident: this.config.ident,
    });
  }

  get(diff) {
    return this.formatter.get(diff);
  }
}

export default Stringify;
