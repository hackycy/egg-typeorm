'use strict';

const fs = require('fs-extra');
const { find } = require('fs-jetpack');
const watch = require('chokidar').watch;
const formatPaths = require('./utils').formatPaths;
const prettier = require('prettier');
const { join } = require('path');

function getTypingText(importText, repoText, entityText) {
  const tpl = `
import 'egg'
import { Repository, Connection } from 'typeorm'
${importText}

declare module 'egg' {
  interface Context {
    connection: Connection
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

function createTyingFile(app) {
  const { baseDir } = app;
  const entityDir = join(baseDir, 'app', 'entity');
  const files = find(entityDir, { matching: '*.ts' });
  const typingPath = join(baseDir, 'typings', 'typeorm.d.ts');
  const pathArr = formatPaths(files);
  const importText = pathArr
    .map(i => `import ${i.name} from '${i.importPath}'`)
    .join('\n');
  const repoText = pathArr
    .map(i => `${i.name}: Repository<${i.name}>`)
    .join('\n');

  // TODO
  const entityText = pathArr.map(i => `${i.name}: any`).join('\n');
  const text = getTypingText(importText, repoText, entityText);
  writeTyping(typingPath, text);
}

function writeTyping(path, text) {
  fs.writeFileSync(path, formatCode(text), { encoding: 'utf8' });
}

function formatCode(text) {
  return prettier.format(text, {
    semi: false,
    tabWidth: 2,
    singleQuote: true,
    parser: 'typescript',
    trailingComma: 'all',
  });
}

function watchEntity(app) {
  const { baseDir } = app;
  const entityDir = join(baseDir, 'app', 'entity');
  const typingsDir = join(baseDir, 'typings');

  if (!fs.existsSync(entityDir)) return;

  fs.ensureDirSync(typingsDir);
  watch(entityDir).on('all', eventType => {
    if ([ 'add', 'change' ].includes(eventType)) {
      createTyingFile(app);
    }

    if ([ 'unlink' ].includes(eventType)) {
      createTyingFile(app);
    }
  });
}

module.exports = { watchEntity };
