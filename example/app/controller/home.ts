import { Controller } from 'egg';
const mark = '[typeorm]';
export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    this.app.logger.info(mark, 'this is logger info');
    ctx.body = await this.service.test.findById(1);
  }
}
