import { Service } from 'egg';

/**
 * Test Service
 */
export default class Test extends Service {

  /**
   * sayHi to you
   * @param name - your name
   */
  public async sayHi(name: string) {
    return `hi, ${name}`;
  }

  public async save(user: any) {
    await this.ctx.repo.db2.User.save(user);
  }

  public async findById(id: number) {
    return await this.ctx.repo.db2.User.find({ id });
  }
}
