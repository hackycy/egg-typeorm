'use strict';

/**
 * egg-typeorm default config
 * @member Config#typeorm
 * @property {String} SOME_KEY - some description
 */
exports.typeorm = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'siyee-api',
  synchronize: true,
  logging: false,
  entities: [ 'app/entity/**/*.ts' ],
  migrations: [ 'app/migration/**/*.ts' ],
  subscribers: [ 'app/subscriber/**/*.ts' ],
  cli: {
    entitiesDir: 'app/entity',
    migrationsDir: 'app/migration',
    subscribersDir: 'app/subscriber',
  },
};
