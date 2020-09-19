'use strict';

const {
  createConnections,
} = require('typeorm');
const { load } = require('./utils');
const path = require('path');

/**
 * 创建数据库连接，并挂载Repo和Entity
 * @param {EggApplication} app EggApplication
 * @param {Array} config TypeORM Connection
 */
async function connect(app, config) {
  const connections = await createConnections(config);
  const match = app.config.env === 'local' ? '**/*.(js|ts)' : '**/*.js';
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
    const { repo, entity } = load(directory, match);
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
  }
  app.logger.info('[typeorm]', 'load entities end');
  return connections;
}

module.exports = { connect };
