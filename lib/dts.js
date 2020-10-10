'use strict';

const prettier = require('prettier');
const path = require('path');
const fs = require('fs');
const { loadOrmConfig, parse, toHump } = require('./utils');
const { getMetadataArgsStorage } = require('typeorm');

/**
 * https://github.com/whxaxes/egg-ts-helper
 * // 自定义 generator
 * module.exports = (config, baseConfig) => {
 * // config.dir       dir
 * // config.dtsDir    d.ts 目录
 *  // config.file      发生更改的文件 file
 *  // config.fileList  path 下的文件列表
 *  console.info(config);
 *  console.info(baseConfig);

 *  // 返回值可以是对象或者数组 { dist: string; content: string } | Array<{ dist: string; content: string }>
 *  // 如果返回的 content 是 undefined，egg-ts-helper 会删除 dist 指向的文件
 *  return {
 *    dist: 'd.ts file url',
 *    content: 'd.ts content'
 *  }
 * }
 *
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
    const items = parse(path.join(baseConfig.cwd, entitiesConfig[entity].entitiesDir), '**/*.ts', false);
    const { importArr, repoObj, entityObj } = render(items, baseConfig.typings);
    if (importArr) {
      importText += importArr.join('\n') + '\n';
    }
    if (repoObj) {
      // .replace(/,/g, '\t')
      const str = JSON.stringify(repoObj).replace(/\"/g, '');
      if (entity === 'default') {
        repoText += str.replace(/^(\s|{)/g, '').replace(/(\s|})$/g, ',');
      } else {
        repoText += `${entity}: ${str},`;
      }
      // repoText += `${str.replace(/}/g, '},')}\t`;
    }
    if (entityObj) {
      // .replace(/,/g, '\t')
      const str = JSON.stringify(entityObj).replace(/\"/g, '');
      if (entity === 'default') {
        entityText += str.replace(/^(\s|{)/g, '').replace(/(\s|})$/g, ',');
      } else {
        entityText += `${entity}: ${str},`;
      }
      // entityText += `${str.replace(/}/g, '},')}\t`;
    }
  });
  const dts = renderTypingText(importText, repoText, entityText);
  return {
    dist: path.join('typings', 'typeorm.d.ts'),
    content: formatCode(dts),
  };
}

/**
 * 生成所需对应格式的对象
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
        // ts-helper get exports is null
        let isTree = false;
        if (fs.existsSync(`${item.fullpath}.js`)) {
          const ent = require(item.fullpath);
          isTree = getMetadataArgsStorage().trees.filter(e => e.target === ent)[0];
        } else if (fs.existsSync(`${item.fullpath}.ts`)) {
          isTree = fs.readFileSync(`${item.fullpath}.ts`).toString().indexOf('@Tree(') >= 0;
        }
        // TreeRepository or Repository
        obj = isTree ? `TreeRepository<${className}>` : `Repository<${className}>`;
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
 * 格式化代码
 * @param {String} text 文本
 */
function formatCode(text) {
  try {
    return prettier.format(text, {
      semi: false,
      tabWidth: 2,
      singleQuote: true,
      parser: 'typescript',
      trailingComma: 'all',
    });
  } catch (e) {
    return renderTypingText();
  }
}

module.exports = { formatCode, generator };
