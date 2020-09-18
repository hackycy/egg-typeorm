'use strict';
Object.defineProperty(exports, '__esModule', {
  value: !0,
});
const e = require('path'),
  t = require('fs'),
  n = require('yamljs'),
  r = require('./Logger');

function i(r) {
  const i = e.join(r, 'ormconfig.yml');
  return t.existsSync(i) ? n.load(i) : {};
}

function s(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
exports.getConnectionOptions = function(t) {
  const n = t.config,
    {
      typeorm: s,
    } = n;
  if (!s || !s.client && !s.clients) return [];
  const o = (c = s.clients, l = s.client ? [ s.client ] : [], c || l);
  let c,
    l;
  const a = i(n.baseDir);
  return o.map(i => {
    const s = Object.assign({}, i, (u = (u = i.name) || 'default') in a ? Object.assign({}, a[u]) : {});
    return s.logger = s.logger || new r.default(t, s.logging), s.entitiesdir && (s.entities = [ e.join(s.entitiesdir, '**', n.env === 'local' ? '*.ts' : '*.js') ]), s;
  });
  let u;
}, exports.getYamlConfig = i, exports.ucFirst = s, exports.getModelName = function(e, t) {
  e = e.replace(/\\/gi, '/'), t && e.indexOf(t) === 0 && (e = e.substr(t.length))[0] === '/' && (e = e.substr(1));
  const n = e.split('/'),
    r = s((n.pop() || '').replace(/\.ts$|\.js$/g, ''));
  return [ ...n.map(e => e.toLowerCase()), r ].join('.');
};
