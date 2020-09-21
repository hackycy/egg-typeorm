'use strict';

const prettier = require('prettier');
const path = require('path');
const { loadOrmConfig, parse, toHump } = require('./utils');
const { getMetadataArgsStorage } = require('typeorm');

/**
 * https://github.com/whxaxes/egg-ts-helper
 * @param {Object} config helper config
 * @param {Object} baseConfig helper base config
 */
function generator(config, baseConfig) {
  // cwd is egg application base dir
  const entitiesConfig = loadOrmConfig(baseConfig.cwd);
  let importText = '';
  let repoText = '';
  let entityText = '';
  Object.keys(entitiesConfig).forEach(entity => {
    const items = parse(path.join(baseConfig.cwd, entitiesConfig[entity].entitiesDir), '**/*.ts');
    const { importArr, repoObj, entityObj } = render(items, baseConfig.typings);
    if (importArr) {
      importText += importArr.join('\n') + '\n';
    }
    if (repoObj) {
      // .replace(/,/g, '\t')
      let str = JSON.stringify(repoObj).replace(/\"/g, '');
      if (entity === 'default') {
        str = str.replace(/^(\s|{)|(\s|})$/g, '');
      } else {
        str = `${entity}: ${str}`;
      }
      repoText += `${str.replace(/}/g, '},')}\t`;
    }
    if (entityObj) {
      // .replace(/,/g, '\t')
      let str = JSON.stringify(entityObj).replace(/\"/g, '');
      if (entity === 'default') {
        str = str.replace(/^(\s|{)|(\s|})$/g, '');
      } else {
        str = `${entity}: ${str}`;
      }
      entityText += `${str.replace(/}/g, '},')}\t`;
    }
  });
  const dts = renderTypingText(importText, repoText, entityText);
  return {
    dist: path.join(baseConfig.typings, 'typeorm.d.ts'),
    content: formatCode(dts),
  };
}

/**
 * Typing File 文本
 * @param {String} importText importText
 * @param {String} repoText repoText
 * @param {String} entityText entityText
 */
function renderTypingText(importText = '', repoText = '', entityText = '') {
  const tpl = `
  import { TreeRepository, Repository } from 'typeorm';
  ${importText}
  
  declare module 'egg' {
    interface Context {
      entity: {
        ${entityText}
      }
      repo: {
        ${repoText}
      }
    }
  }
  `;
  return tpl;
}

/**
 * 生成所需
 * @param {*} fileItems parse item
 * @param {*} typingsdir typing dir
 */
function render(fileItems, typingsdir) {
  const importArr = [],
    repoObj = {},
    entityObj = {};
  for (const item of fileItems) {
    // item { properties: [ 'a', 'b', 'c'], exports }
    // => target.a.b.c = exports
    const filename = path.basename(item.fullpath);
    const className = toHump(item.pathname);
    const importPath = path.join(path.relative(typingsdir, path.dirname(item.fullpath)), filename.replace(/\.ts$|\.js$/g, ''));
    importArr.push(`import ${className} from '${importPath.replace(/\\/g, '/')}';`);
    item.properties.reduce((target, property, index) => {
      let obj;
      if (index === item.properties.length - 1) {
        obj = getMetadataArgsStorage()
          .trees.filter(e => e.target === item.exports)[0] ? `TreeRepository<${className}>` : `Repository<${className}>`;
      } else {
        obj = target[property] || {};
      }
      target[property] = obj;
      return obj;
    }, repoObj);
    item.properties.reduce((target, property, index) => {
      let obj;
      if (index === item.properties.length - 1) {
        obj = `typeof ${className}`;
      } else {
        obj = target[property] || {};
      }
      target[property] = obj;
      return obj;
    }, entityObj);
  }
  return { importArr, repoObj, entityObj };
}

/**
 * 格式化代码
 * @param {String} text 文本
 */
function formatCode(text) {
  return prettier.format(text, {
    semi: false,
    tabWidth: 2,
    singleQuote: true,
    parser: 'typescript',
    trailingComma: 'all',
  });
}

module.exports = { formatCode, generator };
