'use strict';

const {
  createConnections,
  getConnectionManager,
} = require('typeorm');
const { load } = require('./utils');
const path = require('path');
const Logger = require('./logger');

/**
 * 创建数据库连接，并挂载Repo和Entity
 * @param {EggApplication} app EggApplication
 * @param {Array} config TypeORM Connection
 */
async function connect(app, config) {
  const connections = await createConnections(config);
  const match = app.config.env === 'local' ? '**/*.ts' : '**/*.js';
  const baseDir = app.config.baseDir;
  app.context.repo = {};
  app.context.entity = {};
  for (const c of config) {
    const name = c.name || 'default';
    if (name in app.context.repo) {
      throw new Error('Duplicate name in typeorm config');
    }
    const directory = path.join(baseDir, c.entitiesDir);
    // 读取文件
    const { repo, entity } = load(directory, match, name);
    // 挂载Entity以及Repo到Context上
    if (c.name === 'default') {
      Object.keys(repo).forEach(k => {
        app.context.repo[k] = repo[k];
      });
      Object.keys(entity).forEach(k => {
        app.context.entity[k] = entity[k];
      });
    } else {
      app.context.repo[name] = repo;
      app.context.entity[name] = entity;
    }
    // 判断是否定义了日志记录器，如果没有则使用插件默认自定义的记录器
    if (!c.logger) {
      c.logger = new Logger(app, c.logging);
    }
  }
  app.logger.info('[typeorm]', 'load entities end');
  return connections;
}

/**
 * 关闭客户端连接
 */
async function closeConnection() {
  const manager = getConnectionManager();
  for (const connect of manager.connections) {
    if (connect.isConnected) {
      await connect.close();
    }
  }
}

module.exports = { connect, closeConnection };
