import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  // typeorm
  config.typeorm = {
    client: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'test',
      synchronize: true,
      logging: false, //该字段必须配置
    },
    entities: [
      {
        entitiesDir: 'app/entity',
        name: 'default'
      }
    ]
  }
  return config;
};
