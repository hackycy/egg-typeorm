'use strict';

const { connect } = require('./lib/connect');
const { getConnectionOptions } = require('./lib/utils');

class AppBootHook {

  constructor(app) {
    this.app = app;
    const config = app.config.typeorm;

    if (!config) {
      throw new Error('please config typeorm in config file');
    }
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务
    try {
      this.app.logger.info('[typeorm]', 'start connect database');
      const connectionOptions = getConnectionOptions(this.app);
      await connect(this.app, connectionOptions);
      this.app.logger.info('[typeorm]', 'conect dababase success');
    } catch (error) {
      this.app.logger.error('[typeorm]', 'conect dababase fail');
      this.app.logger.error(error);
    }
  }

}

module.exports = AppBootHook;
