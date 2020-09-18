'use strict';
Object.defineProperty(exports, '__esModule', {
  value: !0,
});
const t = '  ';
class e {
  constructor() {
    this.children = [];
  }
  render() {
    return this.children.map(t => t.render()).join('\n');
  }
  append(t) {
    this.children.push(t);
  }
  insert(t, e) {
    this.children.splice(t, 0, e);
  }
}
class r extends e {
  constructor(t) {
    super(), this.name = t;
  }
  render() {
    return [ `${this.name} {`, ...super.render().split('\n').map(e => `${t}${e}`), '}' ].join('\n');
  }
}
class s extends e {
  constructor(t, e) {
    super(), this.name = e, this.path = t;
  }
  render() {
    const {
      name: t,
      path: e,
    } = this;
    return typeof t === 'string' ? `import ${t} from '${e}';` : t instanceof Array ? `import { ${t.join(', ')} } from '${e}';` : `import '${e}';`;
  }
}
class n extends r {
  constructor(t, e) {
    super(`${t}:`), this.value = e;
  }
  render() {
    return this.value ? `${this.name} ${this.value}` : super.render();
  }
}
exports.default = class {
  get last() {
    return this.target_.length ? this.target_[this.target_.length - 1] : null;
  }
  begin() {
    return this.root_ = new e(), this.target_ = [ this.root_ ], this;
  }
  end() {
    return this.target_.pop(), this;
  }
  render() {
    return this.root_.render();
  }
  import(t, e) {
    const r = this.root_;
    if (r) {
      const n = (() => {
        let e = 0;
        for (let n = 0; n < r.children.length; n++) {
          const i = r.children[n];
          if (!(i instanceof s)) break;
          if (i.path === t) return -1;
          e = n + 1;
        }
        return e;
      })();
      if (n !== -1) {
        const i = new s(t, e);
        r.insert(n, i);
      }
    }
    return this;
  }
  declareModule(t) {
    const e = this.last;
    if (e) {
      const s = new class extends r {
        constructor(t) {
          super(`declare module '${t}'`);
        }
      }(t);
      e.append(s), this.target_.push(s);
    }
    return this;
  }
  interface(t) {
    const e = this.last;
    if (e) {
      const s = new class extends r {
        constructor(t) {
          super(`interface ${t}`);
        }
      }(t);
      e.append(s), this.target_.push(s);
    }
    return this;
  }
  property(t, e) {
    const r = this.last;
    if (r) {
      if (t.indexOf('.') >= 0) {
        const r = t.split('.'),
          s = r.shift() || '';
        return this.property(s).property(r.join('.'), e).end();
      }
      const s = r.children.filter(e => e instanceof n && e.name === `${t}:`)[0];
      if (s) return s.value || this.target_.push(s), this;
      const i = new n(t, e);
      r.append(i), e || this.target_.push(i);
    }
    return this;
  }
};
