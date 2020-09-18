'use strict';

const path = require('path');

/**
 * 获取连接配置 对应生成 ConnectionOptions[]
 * @param {EggApplication} app EggApplication
 */
function getConnectionOptions(app) {
  // 判断是否为开发环境，开发环境需要加载TS，生产环境需要加载JS
  const isLocal = app.config.env === 'local';
  const config = app.config;
  const { typeorm } = config;
  if (!typeorm || !typeorm.client && !typeorm.clients) {
    return [];
  }
  // 如果定义了clients 则优先使用clients
  const clientArr = typeorm.clients || [ typeorm.client ];
  return clientArr.map(e => {
    const ed = e.entitiesDir;
    // 防止client定义时没有name属性，以及没有定义name属性值给予default
    e.name = e.name || 'default';
    delete e.entitiesDir;
    e.entities = path.join(ed, '**', isLocal ? '*.(js|ts)' : '*.js');
    return e;
  });
}

module.exports = { getConnectionOptions };
