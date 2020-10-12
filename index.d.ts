import { ConnectionOptions, Connection, EntityManager } from 'typeorm'

declare module 'egg' {

  interface Context {
    ormConnection: Connection
    getOrmConnection(connectionName?: string): Connection
    ormManager: EntityManager
    getOrmManager(connectionName?: string): EntityManager
  }

  interface EggAppConfig {
    typeorm: {
      /**
       * @description typeorm conn option
       */
      client?: ConnectionOptions
      /**
       * @description typeorm conns option
       */
      clients?: Array<ConnectionOptions>
    },
  }
}