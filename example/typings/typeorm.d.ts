// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import Db1User from '../app/entity/db1/user'
import Db2User from '../app/entity/db2/user'

declare module 'egg' {
  interface Context {
    entity: {
      User: typeof Db1User
      db2: { User: typeof Db2User }
    }
    repo: {
      User: Repository<Db1User>
      db2: { User: Repository<Db2User> }
    }
  }
}
