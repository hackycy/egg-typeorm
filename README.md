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
      username: 'root',
      password: '123456',
      database: 'test',
      synchronize: true,
      logging: false,
    },
    // 该字段必须配置
    entities: [
      {
        entitiesDir: 'app/entity',
        name: 'default', // 使用client 则设置name为default
      },
    ]
  }
```

> 该entities字段表示数据库的实体文件存放的路径；
>
> 相当于[connection-options](https://typeorm.io/#/connection-options)中entities配置项为['app/entity/**/*.{js,ts}']

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
  }, {
    name: "model2",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "db2",
    synchronize: true,
  }],
  // name 会根据clients中的name进行匹配实体文件存放
  entities: [
      {
        entitiesDir: 'app/entity/db1',
        name: 'model1',
      },
      {
        entitiesDir: 'app/entity/db2',
        name: 'model1',
      },
    ]
}
```

### 创建实体

```bash
├── controller
│   └── home.ts
├─  entity
    └─sys
      └── user.ts
```

### 实体文件

```ts
// app/entity/sys/user.ts

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
    // 单数据库
    // app/entity/sys/user.ts => ctx.repo.sys.User
    // app/entity/user.ts => ctx.repo.User
    // app/entity/admin/sys/user_role.ys => ctx.repo.admin.sys.UserRole
    // 多数据库 例如获取db1
    // ctx.repo['db1'].user，转换方式同上
    ctx.body = await ctx.repo.sys.User.find()
  }
}
```

> 所有实体会加载在`ctx.entities`中, 所有仓库会加载到`ctx.repo`; 
>
> 多数据库时加载在对应的ctx.entities[connectName]与ctx.repo[connectionName]上; 
>
> **注意：使用name为default会直接挂载，不需要指定connectName**
>
> .d.ts文件会在未来进行支持

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

## 依赖的第三方库

- [globby](https://www.npmjs.com/package/globby)
- [typeorm](https://typeorm.io/#/)

## 有问题或Bug

请直接提出[issues](https://github.com/hackycy/egg-typeorm/issues)

## License

[MIT](LICENSE)
