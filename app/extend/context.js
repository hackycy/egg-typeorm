'use strict';

const { getConnection } = require('typeorm');

module.exports = {
  get connection() {
    return getConnection();
  },
  getConnection(name) {
    return getConnection(name);
  },
};

