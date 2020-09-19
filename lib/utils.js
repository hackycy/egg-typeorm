'use strict';

const path = require('path');
const globby = require('globby');
const fs = require('fs');
const {
  getMetadataArgsStorage,
  getTreeRepository,
  getRepository,
} = require('typeorm');

/**
 * 文件命大小写转换
 * @param {String} filepath 文件路径
 */
function camelize(filepath) {
  const properties = filepath.substring(0, filepath.lastIndexOf('.')).split('/');
  const size = properties.length;
  return properties.map((property, index) => {
    if (!/^[a-z][a-z0-9_-]*$/i.test(property)) {
      throw new Error(`${property} is not match 'a-z0-9_-' in ${filepath}`);
    }
    // use camelize, will capitalize the first letter
    // foo_bar.js > FooBar
    // fooBar.js  > FooBar
    // FooBar.js  > FooBar
    // FooBar.js  > FooBar
    property = property.replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());
    if (index === size - 1) {
      return `${property[0].toUpperCase()}${property.substring(1)}`;
    }
    return property;
  });
}

/**
 * 获取连接配置 对应生成 ConnectionOptions[]
 * @param {EggApplication} app EggApplication
 */
function getConnectionOptions(app) {
  // 判断是否为开发环境，开发环境需要加载TS，生产环境需要加载JS
  const isLocal = app.config.env === 'local';
  const config = app.config;
  const { typeorm } = config;
  if (!typeorm || !typeorm.client && !typeorm.clients) {
    return [];
  }
  // 如果定义了clients 则优先使用clients
  const clientArr = typeorm.clients || [ typeorm.client ];
  return clientArr.map(e => {
    const ed = e.entitiesDir;
    // 防止client定义时没有name属性，以及没有定义name属性值给予default
    e.name = e.name || 'default';
    // delete e.entitiesDir;
    // https://github.com/typeorm/typeorm/issues/2275
    e.entities = [ path.join(ed, '**', isLocal ? '*.(js|ts)' : '*.js') ];
    return e;
  });
}

/**
 * Parse files from given directories, then return an items list, each item contains properties and exports.
 * For example, parse `app/controller/group/repository.js`
 *
 * Item
 *
 * {
 *   properties: [ 'group', 'repository' ],
 *   exports: app => { ... },
 * }
 * @param {String|Array} directory directory
 * @param {String|Array} match glob match
 */
function parse(directory, match) {
  const items = [];
  const files = Array.isArray(match) ? match : [ match ];
  const directories = Array.isArray(directory) ? directory : [ directory ];
  for (const dir of directories) {
    const filepaths = globby.sync(files, { cwd: dir });
    for (const filepath of filepaths) {
      const fullpath = path.join(directory, filepath);
      // 不是文件直接pass
      if (!fs.statSync(fullpath).isFile()) {
        continue;
      }
      // app/service/foo/bar.js => [ 'foo', 'bar' ]
      const properties = camelize(filepath);
      // app/service/foo/bar.js => service.foo.bar
      // const pathName = directory.split(/[/\\]/).slice(-1) + '.' + properties.join('.');
      const exports = require(fullpath);
      // must export default
      if (!exports || !exports.default) {
        continue;
      }
      items.push({ properties, fullpath, exports: exports.default });
    }
  }
  return items;
}

/**
 * 代码参考自：https://github.com/eggjs/egg-core/blob/74d523a9ad208bfa8d3531085811df96878d1711/lib/loader/file_loader.js
 * @param {String|Array} directory directory
 * @param {String|Array} match match
 */
function load(directory, match) {
  const repo = {},
    entity = {};
  const items = parse(directory, match);
  for (const item of items) {
    // item { properties: [ 'a', 'b', 'c'], exports }
    // => target.a.b.c = exports
    item.properties.reduce((target, property, index) => {
      let obj;
      // const properties = item.properties.slice(0, index + 1).join('.');
      if (index === item.properties.length - 1) {
        obj = item.exports;
      } else {
        obj = target[property] || {};
      }
      target[property] = obj;
      return obj;
    }, entity);
    // repo
    item.properties.reduce((target, property, index) => {
      let obj;
      // const properties = item.properties.slice(0, index + 1).join('.');
      if (index === item.properties.length - 1) {
        obj = getMetadataArgsStorage().trees.filter(e => e.target === item.exports)[0] ? getTreeRepository(item.exports) : getRepository(item.exports);
      } else {
        obj = target[property] || {};
      }
      target[property] = obj;
      return obj;
    }, repo);
  }
  return { repo, entity };
}

module.exports = { getConnectionOptions, camelize, parse, load };
