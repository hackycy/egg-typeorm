import { ConnectionOptions, Connection } from 'typeorm'

declare module 'egg' {

  interface PluginConnectionOptions extends ConnectionOptions {
    entitiesDir?: string
  }

  // interface Context {
  //   connection: Connection
  //   getConnection(connectionName?: string): Connection
  // }

  interface EggAppConfig {
    typeorm: {
      /**
       * @description typeorm conn option
       */
      client?: PluginConnectionOptions;
      /**
       * @description typeorm conns option
       */
      clients?: Array<PluginConnectionOptions>;
    },
  }
}