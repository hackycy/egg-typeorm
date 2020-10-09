'use strict';

// const { Logger } = require('typeorm');

const mark = '[typeorm]';

/**
 * 将默认得日志处理转交给Egg的Logger日志
 * 处理方法请查看TypeOrm的Logger
 */
class DefaultLogger {

  /**
   * constructor
   * @param {*} app Egg Application
   * @param {*} logOptions ContectionOptions logging
   */
  constructor(app, logOptions) {
    this.app = app;
    this.logOptions = logOptions;
  }

  logQuery(query, parameters) {
    if (this.isNeedLog('query')) {
      this.app.logger.info(mark, this.parse(query, parameters));
    }
  }

  logQueryError(error, query, parameters) {
    if (this.isNeedLog('error')) {
      this.app.logger.error(mark, `(${error}) : ${this.parse(query, parameters)}`);
    }
  }

  logQuerySlow(time, query, parameters) {
    // 根据maxQueryExecutionTime判断
    this.app.logger.info(mark, `(${time}ms) : ${this.parse(query, parameters)}`);
  }

  logSchemaBuild(message) {
    if (this.isNeedLog('schema')) {
      this.app.logger.info(mark, this.parse(message));
    }
  }

  logMigration(message) {
    this.app.logger.info(mark, this.parse(message));
  }

  log(level, message) {
    // eslint-disable-next-line default-case
    switch (level) {
      // 记录内部 orm 日志消息
      case 'log':
        if (this.isNeedLog('log')) {
          this.app.logger.debug(mark, this.parse(message));
        }
        break;
      // 记录内部 orm 信息性消息
      case 'info':
        if (this.isNeedLog('info')) {
          this.app.logger.info(mark, this.parse(message));
        }
        break;
      // 记录内部 orm 警告
      case 'warn':
        if (this.isNeedLog('warn')) {
          this.app.logger.warn(mark, this.parse(message));
        }
    }
  }

  /**
   * 根据日志选项判断是否使用日志打印，该日志记录器使用true与'all'等价
   * @param {String|Array} loggingType like true or 'all' or ['query', 'error', 'schema', 'warn', 'info', 'log']
   */
  isNeedLog(loggingType) {
    if ((typeof this.logOptions === 'boolean' && this.logOptions)
        || this.logOptions === 'all' || (this.logOptions instanceof Array && this.logOptions.indexOf(loggingType) !== -1)) {
      return true;
    }
    return false;
  }

  parse(query, parameters) {
    return query + (parameters && parameters.length > 0 ? ` -- PARAMETERS : ${this.stringify(parameters)}` : '');
  }

  stringify(param) {
    try {
      return JSON.stringify(param);
    } catch (e) {
      return param;
    }
  }
}

module.exports = DefaultLogger;
