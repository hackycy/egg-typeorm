"use strict";
Object.defineProperty(exports, "__esModule", {
  value: !0
});
const e = require("typeorm"),
  t = require("lodash"),
  o = require("path"),
  n = require("glob"),
  r = require("./util");
  // s 为repo
async function i(i, c, s, a) {
  const {
    baseDir: l
  } = i, {
    entitiesdir: g,
    name: f
  } = c;
  if (!g && !c) return;
  const y = n.sync(o.join(l, `${g}/**/${"local"===i.config.env?"*.ts":"*.js"}`)).map(e => o.relative(l, e).replace(/\\/gi, "/"));
  try {
    for (const n of y) {
      const c = o.join(l, n.replace(/\.(js|ts)$/, "")),
        y = require(c);
      if (!y || !y.default) continue;
      const u = y.default,
        p = r.getModelName(n, g);
      let d;
      d = e.getMetadataArgsStorage().trees.filter(e => e.target === u)[0] ? e.getTreeRepository(u, f) : e.getRepository(u, f), i.logger.info(`[egg-typeorm] set Repository and Entity: ${f}.${p}`), t.set(s, p, d), t.set(a, p, u)
    }
  } catch (e) {
    throw i.logger.error(e), e
  } finally {
    i.logger.info(`[egg-typeorm] end load entities in connection ${c.name}`)
  }
}
exports.closeConnections = async function () {
  const t = e.getConnectionManager();
  for (const e of t.connections) e.isConnected && await e.close()
}, exports.connect = async function (t, o) {
  const n = await e.createConnections(o);
  await async function (e, t) {
    e.context.repo = {}, e.context.entity = {};
    for (let o of t) {
      const t = o.name || "default";
      if (t in e.context.repo) throw new Error("Duplicate name in typeorm connections");
      const n = e.context.repo[t] = {},
        r = e.context.entity[t] = {};
      await i(e, o, n, r), "default" === t && (Object.keys(n).forEach(t => {
        e.context.repo[t] = n[t]
      }), Object.keys(r).forEach(t => {
        e.context.entity[t] = r[t]
      }))
    }
    e.logger.info("[egg-typeorm] end loaded entities")
  }(t, o);
  for (let e of n) {
    const o = await e.manager.query("select 1 + 1 as result");
    o && o.length && 2 == +o[0].result && t.logger.info(`[egg-typeorm] connection ${e.name} is ready`)
  }
};