# egg-typeorm

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@hackycy/egg-typeorm.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@hackycy/egg-typeorm
[download-image]: https://img.shields.io/npm/dm/@hackycy/egg-typeorm.svg?style=flat-square
[download-url]: https://npmjs.org/package/@hackycy/egg-typeorm

[TypeORM](https://typeorm.io/#/) plugin for Egg.js.

## 安装

```bash
$ npm install -S @hackycy/egg-typeorm
```

## 使用

### 插件启用

```ts
// {app_root}/config/plugin.ts
const plugin: EggPlugin = {
  typeorm: {
    enable: true,
    package: '@hackycy/egg-typeorm',
  },
}
```

### 配置config.{env}.ts

[connection-options](https://typeorm.io/#/connection-options)

```ts
// {app_root}/config/config.default.ts
config.typeorm = {
  client: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'test',
    password: 'test',
    database: 'test',
    synchronize: true,
    logging: false,
    entitiesdir: 'app/entity', //该字段必须配置
  }
}
```

> 该文件表示数据库的实体文件存放的路径；相当于[connection-options](https://typeorm.io/#/connection-options)中entities配置项为['app/entity/**/*.{js,ts}']

### 多数据库连接配置

```ts
// {app_root}/config/config.default.ts
config.typeorm = {
  clients: [{
    name: "model1",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "db1",
    synchronize: true,
    entitiesdir: 'app/entity/db1'
  }, {
    name: "model2",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "db2",
    synchronize: true,
    entitiesdir: 'app/entity/db2'
  }]
}
```

### 创建实体

```bash
├── controller
│   └── home.ts
├── entity
    ├── Post.ts
    └── User.ts
```

### 实体文件

```ts
// app/entity/User.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}

export default User
```

### 使用查找

```ts
// in controller
export default class UserController extends Controller {
  public async index() {
    const { ctx } = this
    ctx.body = await ctx.repo.User.find()
  }
}
```
所有实体会加载在ctx.entities中, 所有仓库会加载到ctx.repo; 多数据库时加载在对应的ctx.entities[connectName]与ctx.repo[connectionName]上; 详见typings/typeorm.d.ts文件

### 使用QueryBuilder

```ts
// in controller
export default class UserController extends Controller {
  public async index() {
    const { ctx } = this
    const firstUser = await ctx.repo.User.createQueryBuilder('user')
      .where('user.id = :id', { id: 1 })
      .getOne()
    ctx.body = firstUser
  }
}
```

## 依赖说明

### 依赖的 egg 版本

egg-typeorm 版本 | egg 1.x
--- | ---
1.x | 😁
0.x | ❌

### 依赖的插件

- [globby](https://www.npmjs.com/package/globby)

## 提问交流

请到 [egg issues](https://github.com/eggjs/egg/issues) 异步交流。

## License

[MIT](LICENSE)
