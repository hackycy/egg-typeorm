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
        logging: false,
      },
      {
        name: 'db2',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'test',
        synchronize: true,
        logging: false,
      }
    ]
  }
  return config;
};
