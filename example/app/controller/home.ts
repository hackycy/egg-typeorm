import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await this.ctx.repo.sys.User.find({ id: 1 });
  }
}
