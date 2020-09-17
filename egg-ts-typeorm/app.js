"use strict";
Object.defineProperty(exports, "__esModule", {
  value: !0
});
const e = require("./lib/util"),
  t = require("./lib/connect");
exports.default = class {
  constructor(e) {
    this.app = e
  }
  async didLoad() {
    const o = this.app;
    o.logger.info("[egg-typeorm] start connect database");
    const c = e.getConnectionOptions(o);
    try {
      await t.connect(o, c)
    } catch (e) {
      throw o.logger.error(e), e
    }
  }
  async beforeClose() {
    await t.closeConnections()
  }
};