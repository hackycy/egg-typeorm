'use strict';

const { connect, closeConnection } = require('./lib/connect');
const { getConnectionOptions } = require('./lib/utils');

class AppBootHook {

  constructor(app) {
    this.app = app;
    const config = app.config.typeorm;

    if (!config) {
      throw new Error('please config typeorm in config file');
    }
  }

  /**
   * 所有的配置已经加载完毕
   * 可以用来加载应用自定义的文件，启动自定义的服务
   */
  async didLoad() {
    try {
      this.app.logger.info('[typeorm]', 'start connect database');
      const connectionOptions = getConnectionOptions(this.app);
      await connect(this.app, connectionOptions);
      this.app.logger.info('[typeorm]', 'conect dababase success');
    } catch (error) {
      this.app.logger.error('[typeorm]', 'conect dababase fail');
      throw error;
    }
  }

  /**
   * 应用即将关闭
   */
  async beforeClose() {
    // 关闭连接
    await closeConnection();
  }

}

module.exports = AppBootHook;
