'use strict';

const { connect, loadEntityAndRepoToContext } = require('./lib/connect');
const { getConnectionOptions } = require('./lib/utils');

module.exports = app => {
  // 获取配置
  const config = app.config.typeorm;

  if (!config) {
    throw new Error('please config typeorm in config file');
  }

  app.didLoad(async () => {
    try {
      const connectionOptions = getConnectionOptions(app);
      await connect(app, connectionOptions);
      // }
      await loadEntityAndRepoToContext(app, connectionOptions);
      app.logger.info('[typeorm]', '数据链接成功');
    } catch (error) {
      app.logger.error('[typeorm]', '数据库链接失败');
      app.logger.error(error);
    }
  });

};
