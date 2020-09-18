'use strict';

const { connect, loadEntityAndRepoToContext } = require('./lib/connect');
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
      const connectionOptions = getConnectionOptions(this.app);
      await connect(this.app, connectionOptions);
      // }
      await loadEntityAndRepoToContext(this.app, connectionOptions);
      this.app.logger.info('[typeorm]', '数据链接成功');
    } catch (error) {
      this.app.logger.error('[typeorm]', '数据库链接失败');
      this.app.logger.error(error);
    }
  }

}

module.exports = AppBootHook;
