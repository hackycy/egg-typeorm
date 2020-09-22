// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import Db1User from '../app/entity/db1/user'
import Db1SysUser from '../app/entity/db1/sys/user'
import Db2User from '../app/entity/db2/user'
import Db2SysUser from '../app/entity/db2/sys/user'
import Db3User from '../app/entity/db3/user'
import Db3AdminUser from '../app/entity/db3/admin/user'

declare module 'egg' {
  interface Context {
    entity: {
      User: typeof Db1User
      sys: { User: typeof Db1SysUser }
      db2: { User: typeof Db2User; sys: { User: typeof Db2SysUser } }
      db3: { User: typeof Db3User; admin: { User: typeof Db3AdminUser } }
    }
    repo: {
      User: Repository<Db1User>
      sys: { User: Repository<Db1SysUser> }
      db2: { User: Repository<Db2User>; sys: { User: Repository<Db2SysUser> } }
      db3: {
        User: Repository<Db3User>
        admin: { User: Repository<Db3AdminUser> }
      }
    }
  }
}
