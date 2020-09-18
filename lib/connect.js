'use strict';

const {
  createConnections,
  getMetadataArgsStorage,
  getTreeRepository,
  getRepository,
} = require('typeorm');

const path = require('path');

/**
 * 挂载Entity以及Repo到Context上
 * @param {EggApplication} app EggApplication
 * @param {Array} config typeorm config
 */
async function loadEntityAndRepoToContext(app, config) {
  config.forEach(e => {
    const directory = path.join(app.config.baseDir, e.entitiesDir);
    app.logger.info(`directory is ${directory}`);
    if (e.name === 'default') {
      // 只取default
      app.loader.loadToContext(directory, 'repo', {
        initializer(model) {
          const repo = getMetadataArgsStorage().trees.filter(e => e.target === model)[0] ? getTreeRepository(model) : getRepository(model);
          app.logger.info(repo);
          return repo;
        },
        fieldClass: 'entity',
      });
      app.logger.info('load to context done');
    }
  });
}

/**
 * 创建数据库连接
 * @param {EggApplication} app EggApplication
 * @param {*} config TypeORM Connection
 */
async function connect(app, config) {
  const connections = await createConnections(config);
  return connections;
}

module.exports = { connect, loadEntityAndRepoToContext };
