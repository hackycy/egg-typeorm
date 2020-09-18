'use strict';
Object.defineProperty(exports, '__esModule', {
  value: !0,
});
const e = require('./typings'),
  t = require('path'),
  r = require('glob'),
  o = require('fs'),
  n = require('typeorm'),
  i = require('./util');

function s(e, s) {
  return r.sync(t.join(e, s, '**/*.ts')).map(r => {
    r = t.relative(e, r).replace(/\\/gi, '/');
    const a = i.getModelName(r, s);
    return {
      modelName: a,
      className: `${(s.replace(/\\|\//gi, '.') + a).split('.').map(i.ucFirst).join('')}`,
      importPath: `../${r = r.replace(/\.ts$|\.js$/g, '')}`,
      isTree: function(e) {
        if (o.existsSync(`${e}.js`)) {
          const t = require(e);
          if (t && t.default) return !!n.getMetadataArgsStorage().trees.filter(e => e.target === t.default)[0];
        } else if (o.existsSync(`${e}.ts`)) return o.readFileSync(`${e}.ts`).toString().indexOf('@Tree(') >= 0;
        return !1;
      }(t.join(e, r)),
    };
  });
}

function a(e, t) {
  t.forEach(t => {
    e.property(t.modelName, `typeof ${t.className}`);
  });
}

function c(e, t) {
  t.forEach(t => {
    t.isTree ? e.property(t.modelName, `TreeRepository<${t.className}>`) : e.property(t.modelName, `Repository<${t.className}>`);
  });
}
exports.generator = function(r, o) {
  const n = function(t) {
    const r = i.getYamlConfig(t),
      o = new e.default();
    o.begin().import('typeorm', [ 'Repository', 'Connection', 'TreeRepository' ]), o.declareModule('egg').interface('Context');
    const n = Object.keys(r);
    for (const e of n) {
      const n = r[e];
      if (!n.entitiesdir) continue;
      const {
          entitiesdir: i,
        } = n,
        p = s(t, i);
      p.forEach(e => {
        o.import(e.importPath, e.className);
      }), o.property('entity'), e === 'default' && a(o, p), o.property(e), a(o, p), o.end(), o.end(), o.property('repo'), e === 'default' && c(o, p), o.property(e), c(o, p), o.end(), o.end();
    }
    return o.render();
  }(o.cwd);
  return {
    dist: t.join('typings', 'typeorm.d.ts'),
    content: n,
  };
};
