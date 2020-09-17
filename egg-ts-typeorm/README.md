# egg-ts-typeorm

[TypeORM](https://typeorm.io/#/) plugin for Egg.js.

<!--
Description here.
-->

## 安装

```bash
$ npm install -S egg-ts-typeorm
```

## 使用

### 插件启用

```ts
// {app_root}/config/plugin.ts
const plugin: EggPlugin = {
  typeorm: {
    enable: true,
    package: 'egg-ts-typeorm',
  },
}
```
### 配置ormconfig.yml

在egg项目根目录下新建ormconfig.yml文件；内容如下
```yaml
default: # 默认连接
  entitiesdir: "app/entities"
```
该文件表示数据库的实体文件存放的路径；相当于[connection-options](https://typeorm.io/#/connection-options)中entities配置项为['app/entity/**/*.{js,ts}']

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
    logging: false
  }
}
```

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
    synchronize: true
  }, {
    name: "model2",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "admin",
    database: "db2",
    synchronize: true
  }]
}
```

ormconfig.yml如下:
```yaml
model1: # config.default.ts中对应的name
  entitiesdir: "app/entity/db1"

model2: # 同上
  entitiesdir: "app/entity/db2"
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