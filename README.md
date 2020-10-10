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

### 配置ormconfig.yaml

在项目根目录添加`ormconfig.yaml`文件，并添加以下配置

``` yaml
default: //默认连接
  entitiesDir: app/entity/db1

db2: //多数据库连接时配置
  entitiesDir: app/entity/db2
```

>  该文件表示数据库的实体文件存放的路径；
>
> 相当于[connection-options](https://typeorm.io/#/connection-options)中entities配置项为`['app/entity/**/*.{js,ts}']`，**只需配置目录**

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
    }
  }
```

### 多数据库连接配置

```ts
// {app_root}/config/config.default.ts
config.typeorm = {
  clients: [{
    name: "default",
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
  }]
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

> 所有实体会加载在`ctx.entity`中, 所有仓库会加载到`ctx.repo`; 
>
> 多数据库时加载在对应的`ctx.entity[connectName]`与`ctx.repo[connectionName]`上; 
>
> **注意：使用name为default会直接挂载，不需要指定connectName**
>
> 详细可以查看项目下typings文件夹下的`typeorm.d.ts`

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

> 具体使用可查看exmaple使用案例以及TypeORM使用文档

### 日志

插件默认自定义了一个基于Egg的Logger模块实现的日志记录器。如果配置中没有进行配置`connection-options`中的`logger`，则会默认使用插件提供日志记录器。如果想要更换或者使用原来TypeOrm提供的只需要配置对应字段即可。

## 依赖的第三方库

- [globby](https://www.npmjs.com/package/globby)
- [typeorm](https://typeorm.io/#/)
- [js-yaml](https://www.npmjs.com/package/js-yaml)
- [prettier](https://github.com/prettier/prettier)

## 有问题或Bug

请提出[issues](https://github.com/hackycy/egg-typeorm/issues)

## License

[MIT](LICENSE)
