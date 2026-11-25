/* dc-shim.js: a tiny runtime that renders a Design Component (.dc.html) file as a normal web page.
   It fills {{holes}} from Component.renderVals(), expands <sc-for list="{{items}}" as="x">, wires onClick handlers,
   and patches the DOM in place on setState so CSS transitions keep running. */
(function () {
  const handlers = {};
  let hid = 0;
  function lookup(obj, path) { return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj); }
  function val(v) {
    if (typeof v === 'function') { const id = 'h' + (hid++); handlers[id] = v; return id; }
    return v == null ? '' : String(v);
  }
  function expand(tpl, vals) {
    hid = 0;
    let out = tpl.replace(/<sc-for\s+list="\{\{\s*([\w.]+)\s*\}\}"\s+as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g, (m, list, as, inner) => {
      const items = lookup(vals, list) || [];
      return items.map((it, i) => inner.replace(new RegExp('\\{\\{\\s*' + as + '\\.([\\w.]+)\\s*\\}\\}', 'g'), (mm, key) => val(lookup(it, key)))
                                     .replace(new RegExp('\\{\\{\\s*' + as + '\\s*\\}\\}', 'g'), () => val(it))).join('');
    });
    out = out.replace(/<sc-if\s+value="\{\{\s*([\w.]+)\s*\}\}"[^>]*>([\s\S]*?)<\/sc-if>/g, (m, k, inner) => (lookup(vals, k) ? inner : ''));
    return out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, k) => val(lookup(vals, k)));
  }
  function patch(a, b) {
    if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) { a.replaceWith(b.cloneNode(true)); return; }
    if (a.nodeType === 3) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
    if (a.nodeType !== 1) return;
    for (const at of Array.from(b.attributes)) if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
    for (const at of Array.from(a.attributes)) if (!b.hasAttribute(at.name)) a.removeAttribute(at.name);
    const ac = Array.from(a.childNodes), bc = Array.from(b.childNodes);
    for (let i = 0; i < bc.length; i++) { if (i < ac.length) patch(ac[i], bc[i]); else a.appendChild(bc[i].cloneNode(true)); }
    for (let i = bc.length; i < ac.length; i++) ac[i].remove();
  }
  window.DCLogic = class { constructor(props) { this.props = props || {}; this.state = {}; }
    setState(u) { const p = typeof u === 'function' ? u(this.state, this.props) : u; this.state = Object.assign({}, this.state, p); schedule(); }
    forceUpdate() { schedule(); } };
  let root, tpl, comp, queued = false;
  function render() { queued = false; const t = document.createElement('template'); t.innerHTML = expand(tpl, comp.renderVals ? comp.renderVals() : {});
    const fresh = t.content.firstElementChild; if (!root.firstElementChild) root.appendChild(fresh); else patch(root.firstElementChild, fresh); }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(render); } }
  document.addEventListener('DOMContentLoaded', () => {
    root = document.getElementById('dc-root');
    tpl = root.innerHTML.replace(/\son([A-Z]\w*)="(\{\{[^"]+\}\})"/g, (m, ev, h) => ' data-dc-' + ev.toLowerCase() + '="' + h + '"');
    root.innerHTML = '';
    const src = document.querySelector('script[type="text/x-dc"]');
    const Component = new Function(src.textContent + '\n;return Component;')();
    comp = new Component(JSON.parse('{}'));
    render(); requestAnimationFrame(() => comp.componentDidMount && comp.componentDidMount());
    root.addEventListener('click', (e) => { const el = e.target.closest('[data-dc-click]'); if (el && handlers[el.getAttribute('data-dc-click')]) handlers[el.getAttribute('data-dc-click')](e); });
  });
})();
