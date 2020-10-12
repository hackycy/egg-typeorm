'use strict';

const { getConnection, getManager } = require('typeorm');

module.exports = {
  // Connection
  get ormConnection() {
    return getConnection();
  },
  getOrmConnection(name) {
    return getConnection(name);
  },
  // Manager
  get ormManager() {
    return getManager();
  },
  getOrmManager(name) {
    return getManager(name);
  },
};

