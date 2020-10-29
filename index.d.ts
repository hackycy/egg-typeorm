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
       * @description config mode use json|yml|yaml|js，not egg config
       */
      withoutDir?: boolean
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