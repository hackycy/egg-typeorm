'use strict';

exports.keys = '123456';

exports.typeorm = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'test',
  synchronize: true,
  logging: false,
  entitiesDir: 'app/entity',
  cli: {
    entitiesDir: 'app/entity',
    migrationsDir: 'app/migration',
    subscribersDir: 'app/subscriber',
  },
};

