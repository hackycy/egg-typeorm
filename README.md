# egg-typeorm

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@hackycy/egg-typeorm.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@hackycy/egg-typeorm
[download-image]: https://img.shields.io/npm/dm/@hackycy/egg-typeorm.svg?style=flat-square
[download-url]: https://npmjs.org/package/@hackycy/egg-typeorm

[TypeORM](https://github.com/typeorm/typeorm) plugin for Egg.js.

## 安装

```bash
$ npm install -S @hackycy/egg-typeorm typeorm mysql
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

### 配置实体存放目录

在项目根目录添加`ormconfig.{js|json|yaml|yml}`文件（配置支持后缀中的任意一种即可）

**ormconfig.js**

``` javascript
// 单数据库连接
module.exports = {
  entitiesDir: "app/entity/db1"
};

// 或者多数据库连接
module.exports = [
  {
    name: 'default',
    entitiesDir: "app/entity/db1"
  }，
  {
    name: 'db2',
    entitiesDir: "app/entity/db2"
  }
];
```

**ormconfig.json**

``` json
// 单数据库连接
{
  "entitiesDir": "app/entity/db2",
}
// 或者多数据库连接
[
  {
    "name": "default",
    "entitiesDir": "app/entity/db1"
  },
  {
    "name": "db2",
    "entitiesDir": "app/entity/db2"
  }
]
```

**ormconfig.yaml或ormconfig.yml**

``` yaml
# yaml || yml
default: //默认连接
  entitiesDir: app/entity/db1

db2: //或者多数据库连接时配置
  entitiesDir: app/entity/db2
```

>  **entitiesDir**表示数据库的实体文件存放的路径；
>
>  js、json、yaml、yml插件会按照该顺序查找对应ormconfig后缀的文件，找到则不会再使用其它后缀的配置。
>
>  注意这里是有优先级的。
>
>  相当于[connection-options](https://typeorm.io/#/connection-options)中entities配置项为`['app/entity/**/*.{js,ts}']`，**只需配置目录**

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

> 注意：如果定义了clients，插件会直接忽略掉client的配置，只能二选一配置

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

// 注意：这里必须要以 default 导出， 否则插件无法查找到定义的类文件
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

> 具体使用可查看[exmaple](https://github.com/hackycy/egg-typeorm/tree/main/example)使用案例, 实战示例可参考：[sf-egg-admin](https://github.com/hackycy/sf-egg-admin)

### 日志

插件默认自定义了一个基于Egg的Logger模块实现的日志记录器。如果配置中没有进行配置`connection-options`中的`logger`，则会默认使用插件提供日志记录器。如果想要更换或者使用原来TypeOrm提供的只需要配置对应字段即可。

### 自定义环境

常规开发流程可能不仅仅只有**prod**才是预设的生产环境，可通过该配置来自定义环境来适应自己的开发流程。

> 用于区分开发环境及生产环境，开发环境使用的`ts-node`运行，生产环境应需要把TS编译成JS再运行。

``` js
config.typeorm = {
  prodEnv: [ 'prod', 'stagging' ]
}
// or
config.typeorm = {
  prodEnv: 'prod'
}
```

### 框架内置Context扩展

**获取getConnection**

``` typescript
this.ctx.ormConnection || this.ctx.getOrmConnection('connectionName')
```

**获取getManager**

```typescript
this.ctx.ormManager || this.ctx.getOrmManager('connectionName')
```

## 依赖的第三方库

- [globby](https://www.npmjs.com/package/globby)
- [typeorm](https://typeorm.io/#/)
- [js-yaml](https://www.npmjs.com/package/js-yaml)
- [prettier](https://github.com/prettier/prettier)

## 有问题或Bug

请提出[issues](https://github.com/hackycy/egg-typeorm/issues)

## License

[MIT](LICENSE)
