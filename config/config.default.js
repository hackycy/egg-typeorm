'use strict';

/**
 * egg-typeorm default config
 * @member Config#typeorm
 * @property {String} SOME_KEY - some description
 */
exports.typeorm = {
  client: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'test',
    password: '123456',
    database: 'test',
    synchronize: true,
    logging: false
  }
}

// config.typeorm = {
//   clients: [{
//     name: "model1",
//     type: "mysql",
//     host: "localhost",
//     port: 3306,
//     username: "root",
//     password: "admin",
//     database: "db1",
//     synchronize: true
//   }, {
//     name: "model2",
//     type: "mysql",
//     host: "localhost",
//     port: 3306,
//     username: "root",
//     password: "admin",
//     database: "db2",
//     synchronize: true
//   }]
// }