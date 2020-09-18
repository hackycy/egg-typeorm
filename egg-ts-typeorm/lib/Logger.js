'use strict';
Object.defineProperty(exports, '__esModule', {
  value: !0,
});
const t = 'egg-typeorm';
exports.default = class {
  constructor(t, o) {
    this.app = t, this.options = o;
  }
  logQuery(o, s) {
    const {
      app: i,
    } = this;
    if (this.options === 'all' || !0 === this.options || this.options instanceof Array && this.options.indexOf('query') !== -1) {
      const n = o + (s && s.length ? ' -- PARAMETERS: ' + this.stringifyParams(s) : '');
      i.logger.info(`[${t}] ${n}`);
    }
  }
  logQueryError(o, s, i) {
    const {
      app: n,
    } = this;
    if (this.options === 'all' || !0 === this.options || this.options instanceof Array && this.options.indexOf('error') !== -1) {
      const r = s + (i && i.length ? ' -- PARAMETERS: ' + this.stringifyParams(i) : '');
      n.logger.error(`[${t}] ${r}: ${o}`);
    }
  }
  logQuerySlow(o, s, i) {
    const {
        app: n,
      } = this,
      r = s + (i && i.length ? ' -- PARAMETERS: ' + this.stringifyParams(i) : '');
    n.logger.info(`[${t}](${o}ms) ${r}`);
  }
  logSchemaBuild(o) {
    const {
      app: s,
    } = this;
    (this.options === 'all' || this.options instanceof Array && this.options.indexOf('schema') !== -1) && s.logger.info(`[${t}] ${o}`);
  }
  logMigration(o) {
    const {
      app: s,
    } = this;
    s.logger.info(`[${t}] ${o}`);
  }
  log(o, s) {
    const {
      app: i,
    } = this;
    switch (o) {
      case 'log':
        (this.options === 'all' || this.options instanceof Array && this.options.indexOf('log') !== -1) && i.logger.debug(`[${t}] ${s}`);
        break;
      case 'info':
        (this.options === 'all' || this.options instanceof Array && this.options.indexOf('info') !== -1) && i.logger.info(`[${t}] ${s}`);
        break;
      case 'warn':
        (this.options === 'all' || this.options instanceof Array && this.options.indexOf('warn') !== -1) && i.logger.warn(`[${t}] ${s}`);
    }
  }
  stringifyParams(t) {
    try {
      return JSON.stringify(t.map(t => (typeof t === 'string' && t.length > 255 ? `${t.substr(0, 255)}...` : t)));
    } catch (o) {
      return t;
    }
  }
};
