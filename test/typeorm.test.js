'use strict';

const mock = require('egg-mock');

describe('test/typeorm.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/typeorm-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, typeorm')
      .expect(200);
  });
});
