'use strict';

const { connectDB, loadEntityAndModel } = require('./lib/connect');
const { watchEntity } = require('./lib/dts');

module.exports = app => {
  // 获取配置
  const config = app.config.typeorm;

  if (!config) {
    throw new Error('please config typeorm in config file');
  }

  app.beforeStart(async () => {
    try {
      await connectDB(app);
      // if (app.config.env === 'local') {
      watchEntity(app);
      // }
      await loadEntityAndModel(app);
      app.logger.info('[typeorm]', '数据链接成功');
    } catch (error) {
      app.logger.error('[typeorm]', '数据库链接失败');
      app.logger.error(error);
    }
  });

};
