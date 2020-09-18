'use strict';
Object.defineProperty(exports, '__esModule', {
  value: !0,
});
const e = require('typeorm');
exports.default = {
  get connection() {
    return e.getConnection();
  },
  getConnection: t => e.getConnection(t),
};
