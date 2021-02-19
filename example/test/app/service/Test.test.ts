import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/Test.test.js', () => {
  let ctx: Context;

  before(async () => {
    ctx = app.mockContext();
  });

  it('sayHi', async () => {
    const result = await ctx.service.test.sayHi('egg');
    assert(result === 'hi, egg');
  });

  it('saveUser', async () => {
    await ctx.service.test.save({ id: 3, loginID: 'some', name: 'test' });
    const result = await ctx.service.test.findById(3);
    assert(result);
  });
});
