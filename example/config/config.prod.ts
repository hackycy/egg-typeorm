import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  // typeorm
  config.typeorm = {
    clients: [
      {
        name: 'default',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'test',
        synchronize: true,
        logging: 'all',
      },
      {
        name: 'db2',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'test2',
        synchronize: true,
        logging: 'all',
      },
      {
        name: 'db3',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'test3',
        synchronize: true,
        logging: 'all',
      }
    ]
  }
  return config;
};
