"use strict";
Object.defineProperty(exports, "__esModule", {
  value: !0
});
const t = "egg-typeorm";
exports.default = class {
  constructor(t, o) {
    this.app = t, this.options = o
  }
  logQuery(o, s) {
    const {
      app: i
    } = this;
    if ("all" === this.options || !0 === this.options || this.options instanceof Array && -1 !== this.options.indexOf("query")) {
      const n = o + (s && s.length ? " -- PARAMETERS: " + this.stringifyParams(s) : "");
      i.logger.info(`[${t}] ${n}`)
    }
  }
  logQueryError(o, s, i) {
    const {
      app: n
    } = this;
    if ("all" === this.options || !0 === this.options || this.options instanceof Array && -1 !== this.options.indexOf("error")) {
      const r = s + (i && i.length ? " -- PARAMETERS: " + this.stringifyParams(i) : "");
      n.logger.error(`[${t}] ${r}: ${o}`)
    }
  }
  logQuerySlow(o, s, i) {
    const {
      app: n
    } = this, r = s + (i && i.length ? " -- PARAMETERS: " + this.stringifyParams(i) : "");
    n.logger.info(`[${t}](${o}ms) ${r}`)
  }
  logSchemaBuild(o) {
    const {
      app: s
    } = this;
    ("all" === this.options || this.options instanceof Array && -1 !== this.options.indexOf("schema")) && s.logger.info(`[${t}] ${o}`)
  }
  logMigration(o) {
    const {
      app: s
    } = this;
    s.logger.info(`[${t}] ${o}`)
  }
  log(o, s) {
    const {
      app: i
    } = this;
    switch (o) {
      case "log":
        ("all" === this.options || this.options instanceof Array && -1 !== this.options.indexOf("log")) && i.logger.debug(`[${t}] ${s}`);
        break;
      case "info":
        ("all" === this.options || this.options instanceof Array && -1 !== this.options.indexOf("info")) && i.logger.info(`[${t}] ${s}`);
        break;
      case "warn":
        ("all" === this.options || this.options instanceof Array && -1 !== this.options.indexOf("warn")) && i.logger.warn(`[${t}] ${s}`)
    }
  }
  stringifyParams(t) {
    try {
      return JSON.stringify(t.map(t => "string" == typeof t && t.length > 255 ? `${t.substr(0,255)}...` : t))
    } catch (o) {
      return t
    }
  }
};