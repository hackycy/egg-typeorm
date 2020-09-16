'use strict';

const Container = require('typedi').Container;
const {
  createConnection,
  getRepository,
  useContainer,
} = require('typeorm');
const { join } = require('path');
const { getModelName } = require('./utils');
const fs = require('fs-extra');
const { find } = require('fs-jetpack');

/**
 * 处理开发环境和生产环境
 * @param {*} config typeorm配置
 * @param {*} isLocal 是否为开发环境
 */
function handleConfig(config, isLocal) {
  if (isLocal) {
    return config;
  }
  const keys = [ 'entities', 'migrations', 'subscribers' ];
  for (const key of keys) {
    if (config[key]) {
      const newValue = config[key].map(item =>
        item.replace(/\.ts$/, '.js')
      );
      config[key] = newValue;
    }
  }
  return config;
}

function getEntityFromPath(app, entityPath) {
  const connection = app.context.connection;
  const fileModule = require(entityPath);
  const entities = Object.keys(fileModule).reduce(
    (result, cur) => {
      try {
        // TODO: 太 hack
        connection.getMetadata(fileModule[cur]);
        if (!result.includes(fileModule[cur])) {
          return [ ...result, fileModule[cur] ];
        }
        return result;
      } catch (e) {
        //
      }

      return result;
    },
    []
  );

  if (!entities.length) {
    throw new Error(`${entityPath} 格式不正确，不存在 @entity`);
  }

  return entities[0];
}

async function loadEntityAndModel(app) {
  const { baseDir } = app;
  const isLocal = app.config.env === 'local';
  const entityDir = join(baseDir, 'app', 'entity');

  if (!fs.existsSync(entityDir)) return;

  const matching = isLocal ? '*.ts' : '*.js';

  const files = find(entityDir, { matching });
  app.context.repo = {};
  app.context.entity = {};

  try {
    for (const file of files) {
      const entityPath = join(baseDir, file);
      const entity = getEntityFromPath(app, entityPath);
      const name = getModelName(file);
      app.context.repo[name] = getRepository(entity);
      app.context.entity[name] = entity;
    }
  } catch (e) {
    app.logger.error(e);
  }
}

async function connectDB(app) {
  const isLocal = app.config.env === 'local';
  const config = handleConfig(app.config.typeorm, isLocal);
  useContainer(Container);

  const connection = await createConnection(config);
  app.context.connection = connection;
}

module.exports = { connectDB, loadEntityAndModel };
