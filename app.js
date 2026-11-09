/* Tamayo Cart — app logic. No network calls besides loading its own files. */
(function () {
  'use strict';
  var Core = window.TamayoCore, Plan = window.TamayoPlan, Meals = window.TamayoMeals, Recipes = window.TamayoRecipes;
  var $ = function (id) { return document.getElementById(id); };
  var money = Core.money;

  // ---------------- state ----------------
  var KEY = 'tamayoCart.v1', HKEY = 'tamayoCart.history.v1', PKEY = 'tamayoCart.plan.v1';
  var defaults = { items: [], budget: Meals.defaultBudget, budgetV: Plan.BUDGET_V, store: '', taxOn: true, taxRate: 10.25, theme: 'auto', nextId: 1, view: 'cart' };
  var hadSaved = (function () { try { return localStorage.getItem(KEY) != null; } catch (e) { return false; } })();
  var state = load(KEY, defaults);
  if (hadSaved) { delete defaults.budgetV; state = Plan.migrateBudget(Object.assign({}, defaults, state)); defaults.budgetV = Plan.BUDGET_V; } // old default budget (none) -> $325
  else state = Object.assign({}, defaults, state);
  var history = load(HKEY, []);
  var plan = Plan.normalizePlan(load(PKEY, {}), Meals);
  var undoSnap = null;

  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? JSON.parse(JSON.stringify(d)) : v; } catch (e) { return JSON.parse(JSON.stringify(d)); } }
  function save() {
    Plan.sync(plan, state.items);
    try { localStorage.setItem(KEY, JSON.stringify(state)); localStorage.setItem(HKEY, JSON.stringify(history)); localStorage.setItem(PKEY, JSON.stringify(plan)); } catch (e) { toast('Could not save — storage full?'); }
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(v) { var n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : NaN; }
  function fmtQty(q) { return (Math.round(q * 100) / 100).toString(); }
  function buzz(ms) { try { navigator.vibrate && navigator.vibrate(ms || 15); } catch (e) {} }

  function applyTheme() { if (state.theme === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', state.theme); }

  // ---------------- render ----------------
  function totals() { return Core.computeTotals(state.items, { taxOn: state.taxOn, rate: state.taxRate, budget: state.budget }); }

  function render() {
    var t = totals();
    $('total').textContent = money(t.total);
    var parts = [fmtQty(t.count) + (t.count === 1 ? ' item' : ' items')];
    if (state.taxOn && t.taxableSubtotal > 0) parts.push('incl. ' + money(t.tax) + ' tax');
    else if (state.taxOn) parts.push('tax on taxable items: ' + state.taxRate + '%');
    $('subline').textContent = parts.join(' · ');
    var sum = $('summary');
    sum.dataset.level = t.level;
    if (t.budget > 0) {
      $('remaining').textContent = t.remaining < 0 ? money(-t.remaining) + ' over' : money(t.remaining);
      var pct = Math.min(100, Math.round(t.pct * 100));
      $('barFill').style.width = pct + '%';
      $('bar').setAttribute('aria-valuenow', pct);
      $('barCaption').textContent = t.level === 'over' ? 'Over budget by ' + money(-t.remaining) + ' — budget ' + money(t.budget)
        : Math.round(t.pct * 100) + '% of ' + money(t.budget) + ' budget';
    } else {
      $('remaining').textContent = 'Set budget';
      $('barFill').style.width = '0%';
      $('barCaption').textContent = 'Tap “Set budget” to track what’s left';
    }
    var ul = $('items');
    ul.innerHTML = state.items.map(function (it, i) {
      var lt = Math.round(Math.round(it.price * 100) * it.qty) / 100;
      var meta = money(it.price) + (it.perWeight ? '/lb' : ' each');
      return '<li class="item" data-id="' + it.id + '">' +
        '<div class="info" data-act="edit"><div class="name">' + esc(it.name || ('Item ' + (i + 1))) +
        (it.taxable ? '<span class="tag">TAX</span>' : '') + '</div>' +
        '<div class="meta">' + esc(meta) + (it.note ? ' · ' + esc(it.note) : '') + '</div></div>' +
        '<div class="lt">' + money(lt) + '</div>' +
        '<div class="qty"><div class="row-actions">' +
        '<button class="qbtn" data-act="minus" aria-label="One less">−</button>' +
        '<span class="qv" aria-label="Quantity">' + fmtQty(it.qty) + (it.perWeight ? ' lb' : '') + '</span>' +
        '<button class="qbtn" data-act="plus" aria-label="One more">+</button></div>' +
        '<div class="row-actions"><button class="icon-btn" data-act="edit" aria-label="Edit">✏️</button>' +
        '<button class="icon-btn" data-act="del" aria-label="Remove">🗑️</button></div></div></li>';
    }).reverse().join(''); // newest on top
    $('empty').hidden = state.items.length > 0;
    $('store').value = state.store || '';
    renderPlan();
  }

  // ---------------- toast ----------------
  var toastTimer;
  function toast(msg, action) {
    var el = $('toast');
    el.innerHTML = esc(msg) + (action ? ' <button class="btn" style="min-height:36px;margin-left:8px;background:#fff;color:#111" id="toastAct">' + esc(action.label) + '</button>' : '');
    el.style.pointerEvents = action ? 'auto' : 'none';
    el.classList.add('show');
    if (action) $('toastAct').onclick = function () { action.fn(); el.classList.remove('show'); };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); el.style.pointerEvents = 'none'; }, action ? 5000 : 2200);
  }
  function snapshot() { undoSnap = JSON.stringify({ items: state.items, plan: plan }); }
  function undo() { if (undoSnap) { var u = JSON.parse(undoSnap); state.items = u.items; plan = Plan.normalizePlan(u.plan, Meals); undoSnap = null; save(); render(); } }

  // ---------------- list interactions ----------------
  $('items').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]'); if (!btn) return;
    var li = e.target.closest('.item'); var id = +li.dataset.id;
    var it = state.items.find(function (x) { return x.id === id; }); if (!it) return;
    var act = btn.dataset.act;
    if (act === 'plus') { it.qty = Math.round((it.qty + 1) * 100) / 100; buzz(); }
    else if (act === 'minus') {
      if (it.qty > 1) it.qty = Math.round((it.qty - 1) * 100) / 100;
      else { snapshot(); state.items = state.items.filter(function (x) { return x !== it; }); toast('Removed ' + (it.name || 'item'), { label: 'Undo', fn: undo }); }
      buzz();
    }
    else if (act === 'del') { snapshot(); state.items = state.items.filter(function (x) { return x !== it; }); toast('Removed ' + (it.name || 'item'), { label: 'Undo', fn: undo }); }
    else if (act === 'edit') { openSheet({ mode: 'edit', item: it }); return; }
    save(); render();
  });
  $('store').addEventListener('change', function () { state.store = this.value.trim(); save(); });

  // ---------------- item sheet ----------------
  var sheetCtx = null;
  function openSheet(ctx) {
    sheetCtx = ctx;
    var it = ctx.item || {};
    var o = ctx.ocr;
    $('sheetTitle').textContent = ctx.mode === 'edit' ? 'Edit item' : (o ? 'Confirm price' : 'Add item');
    $('sheetSave').textContent = ctx.mode === 'edit' ? 'Save changes' : 'Add to cart';
    $('sheetDelete').hidden = ctx.mode !== 'edit';
    $('sheetRescan').hidden = !o;
    $('fPrice').value = it.price != null ? it.price.toFixed(2) : (o && o.price != null ? o.price.toFixed(2) : '');
    $('fName').value = it.name || (o && o.name) || '';
    $('fQty').value = fmtQty(it.qty || 1);
    $('fTaxable').checked = !!it.taxable;
    sheetCtx.note = it.note || (o && o.multiQty ? o.multiQty + ' for ' + money(o.multiTotal) : '') || '';
    sheetCtx.perWeight = it.perWeight || (o && o.perWeight) || false;
    if (o) {
      $('ocrPreview').hidden = false;
      $('ocrImg').src = o.img;
      $('ocrNote').innerHTML = o.price != null
        ? 'Read <b>' + money(o.price) + '</b>' + (o.note ? ' — ' + esc(o.note) : '') + '. Check it matches the tag.'
        : '<b>Couldn’t read a price.</b> Type it in, or rescan closer with less glare.';
      var chips = (o.candidates || []).slice(0, 5);
      $('chips').innerHTML = chips.length > 1 ? chips.map(function (c) {
        return '<button type="button" class="chip' + (c.price === o.price ? ' on' : '') + '" data-p="' + c.price.toFixed(2) + '">' + money(c.price) + '</button>';
      }).join('') : '';
    } else { $('ocrPreview').hidden = true; }
    if (ctx.listId && !it.name) {
      var li0 = curItems().find(function (x) { return x.id === ctx.listId; });
      if (li0) $('fName').value = li0.name;
    }
    fillListSelect(ctx);
    $('sheetWrap').hidden = false;
    updateLineTotal();
    if (!o && ctx.mode !== 'edit') setTimeout(function () { $('fPrice').focus(); }, 60);
  }
  function closeSheet() { $('sheetWrap').hidden = true; sheetCtx = null; pendingListId = null; }
  // ---- link a cart item to the meal-plan shopping list ----
  function curItems() { return Plan.weekItems(Meals, plan, plan.week, state.items); }
  function linkedListId(cartId) {
    var d = plan.weeks[plan.week].done;
    return Object.keys(d).find(function (k) { return d[k].cartId === cartId; }) || '';
  }
  function fillListSelect(ctx) {
    var items = curItems();
    var cur = ctx.listId || (ctx.item && ctx.item.id != null ? linkedListId(ctx.item.id) : '') || '';
    ctx.prevListId = ctx.item && ctx.item.id != null ? linkedListId(ctx.item.id) : '';
    var groups = Plan.groupBySection(Meals, items.filter(function (x) { return !x.checked || x.id === cur; }));
    $('fList').innerHTML = '<option value="">— Not on the list —</option>' + groups.map(function (g) {
      return '<optgroup label="' + esc(g.label) + '">' + g.items.map(function (x) {
        return '<option value="' + esc(x.id) + '">' + esc(x.name) + (x.est != null ? ' (~' + money(x.est) + ')' : '') + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
    $('fList').value = cur;
    $('listLinkLabel').textContent = 'Check off on ' + Meals.weeks[plan.week].label + ' shopping list';
    updateSuggest();
  }
  function updateSuggest() {
    var b = $('listSuggest');
    if (!sheetCtx || $('fList').value) { b.hidden = true; return; }
    var m = Plan.bestMatch(curItems(), $('fName').value);
    if (!m) { b.hidden = true; return; }
    b.hidden = false; b.dataset.id = m.id; b.textContent = '✓ Check off “' + m.name + '”?';
  }
  $('listSuggest').onclick = function () { $('fList').value = this.dataset.id; this.hidden = true; buzz(); };
  $('fList').addEventListener('change', updateSuggest);
  $('fName').addEventListener('input', updateSuggest);
  function updateLineTotal() {
    var p = num($('fPrice').value), q = num($('fQty').value);
    $('lineTotal').textContent = isFinite(p) && isFinite(q) && p > 0 && q > 0
      ? fmtQty(q) + ' × ' + money(p) + ' = ' + money(Math.round(Math.round(p * 100) * q) / 100) + (sheetCtx && sheetCtx.perWeight ? '  (qty = weight in lb)' : '') : '';
  }
  $('chips').addEventListener('click', function (e) {
    var c = e.target.closest('.chip'); if (!c) return;
    $('fPrice').value = c.dataset.p;
    Array.prototype.forEach.call(this.children, function (x) { x.classList.toggle('on', x === c); });
    updateLineTotal();
  });
  $('fPrice').addEventListener('input', updateLineTotal);
  $('fQty').addEventListener('input', updateLineTotal);
  $('qPlus').onclick = function () { var q = num($('fQty').value) || 0; $('fQty').value = fmtQty(Math.floor(q) + 1); updateLineTotal(); buzz(); };
  $('qMinus').onclick = function () { var q = num($('fQty').value) || 1; $('fQty').value = fmtQty(Math.max(1, Math.ceil(q) - 1)); updateLineTotal(); buzz(); };
  $('sheetClose').onclick = closeSheet;
  $('sheetWrap').addEventListener('click', function (e) { if (e.target === this) closeSheet(); });
  $('sheetDelete').onclick = function () {
    var it = sheetCtx.item; snapshot();
    state.items = state.items.filter(function (x) { return x !== it; });
    save(); render(); closeSheet(); toast('Removed', { label: 'Undo', fn: undo });
  };
  $('sheetRescan').onclick = function () { var keep = $('fList').value || (sheetCtx && sheetCtx.listId) || null; closeSheet(); pendingListId = keep; openCamera(); };
  $('sheet').addEventListener('submit', function (e) {
    e.preventDefault();
    var price = Core.round2(num($('fPrice').value));
    var qty = num($('fQty').value);
    if (!(price > 0) || price > 9999) { toast('Enter a price, like 3.99'); $('fPrice').focus(); return; }
    if (!(qty > 0)) qty = 1;
    qty = Math.round(qty * 100) / 100;
    var data = { name: $('fName').value.trim(), price: price, qty: qty, taxable: $('fTaxable').checked, note: sheetCtx.note || '', perWeight: !!sheetCtx.perWeight };
    var lid = $('fList').value, listName = '';
    if (lid && !data.name) { var lx = curItems().find(function (x) { return x.id === lid; }); if (lx) data.name = lx.name; }
    var target;
    if (sheetCtx.mode === 'edit') target = Object.assign(sheetCtx.item, data);
    else { data.id = state.nextId++; data.added = Date.now(); state.items.push(data); target = data; }
    if (lid) { Plan.link(plan, plan.week, lid, target); listName = (curItems().find(function (x) { return x.id === lid; }) || {}).name || ''; }
    else if (sheetCtx.prevListId) delete plan.weeks[plan.week].done[sheetCtx.prevListId];
    var wasAdd = sheetCtx.mode !== 'edit';
    save(); render(); closeSheet(); buzz(25);
    if (wasAdd) {
      var t = totals();
      toast('Added ' + money(Math.round(Math.round(price * 100) * qty) / 100) + (listName ? ' · ✓ ' + listName : '') + ' · total ' + money(t.total) + (t.level === 'over' ? ' — over budget!' : ''));
    }
  });

  // ---------------- dialogs ----------------
  function openDlg(title, html, onReady) {
    $('dlgTitle').textContent = title; $('dlgBody').innerHTML = html; $('dlgWrap').hidden = false;
    if (onReady) onReady($('dlgBody'));
  }
  function closeDlg() { $('dlgWrap').hidden = true; }
  $('dlgClose').onclick = closeDlg;
  $('dlgWrap').addEventListener('click', function (e) { if (e.target === this) closeDlg(); });

  $('budgetBtn').onclick = function () {
    openDlg('Grocery budget',
      '<div class="stack"><label class="field"><span>Budget for this week’s groceries</span><div class="price-input"><span>$</span><input id="bIn" inputmode="decimal" placeholder="0.00" value="' + (state.budget ? state.budget.toFixed(2) : '') + '"></div></label>' +
      '<div class="chips">' + [100, 150, 200, 250, 325, 400].map(function (v) { return '<button type="button" class="chip" data-b="' + v + '">$' + v + '</button>'; }).join('') + '</div>' +
      '<button class="btn primary xl" id="bSave">Save budget</button><button class="btn ghost" id="bClear">No budget</button>' +
      '<p class="muted">The bar turns amber at 80% and red when you go over. Budget includes tax on taxable items.</p></div>',
      function (root) {
        var inp = root.querySelector('#bIn'); setTimeout(function () { inp.focus(); inp.select(); }, 60);
        root.querySelector('.chips').onclick = function (e) { var c = e.target.closest('.chip'); if (c) { inp.value = (+c.dataset.b).toFixed(2); } };
        root.querySelector('#bSave').onclick = function () { var v = num(inp.value); state.budget = v > 0 ? Core.round2(v) : 0; save(); render(); closeDlg(); };
        root.querySelector('#bClear').onclick = function () { state.budget = 0; save(); render(); closeDlg(); };
      });
  };

  $('settingsBtn').onclick = function () {
    openDlg('Tax & settings',
      '<div class="stack">' +
      '<label class="toggle"><input type="checkbox" id="sTax"' + (state.taxOn ? ' checked' : '') + '><span class="sw"></span><span>Add sales tax to taxable items<small>Most groceries are not taxed in California. Mark an item “taxable” when you add it.</small></span></label>' +
      '<label class="field"><span>Sales tax rate (%) — Downey / LA County is 10.25%</span><input id="sRate" inputmode="decimal" value="' + state.taxRate + '"></label>' +
      '<div class="field"><span>Theme</span><div class="chips" id="sTheme">' + ['auto', 'light', 'dark'].map(function (t) { return '<button type="button" class="chip' + (state.theme === t ? ' on' : '') + '" data-t="' + t + '">' + t[0].toUpperCase() + t.slice(1) + '</button>'; }).join('') + '</div></div>' +
      '<button class="btn primary xl" id="sSave">Save</button>' +
      '<p class="muted">Tip: on iPhone tap Share → “Add to Home Screen”; on Android tap ⋮ → “Install app”. After the first load it works with no signal.</p>' +
      '<p class="muted" id="sOffline"></p></div>',
      function (root) {
        root.querySelector('#sTheme').onclick = function (e) { var c = e.target.closest('.chip'); if (!c) return; Array.prototype.forEach.call(this.children, function (x) { x.classList.toggle('on', x === c); }); };
        root.querySelector('#sSave').onclick = function () {
          state.taxOn = root.querySelector('#sTax').checked;
          var r = num(root.querySelector('#sRate').value); state.taxRate = r >= 0 && r < 30 ? r : 10.25;
          var on = root.querySelector('#sTheme .on'); state.theme = on ? on.dataset.t : 'auto';
          applyTheme(); save(); render(); closeDlg();
        };
        root.querySelector('#sOffline').textContent = navigator.serviceWorker && navigator.serviceWorker.controller ? '✓ Offline mode is ready on this device.' : 'Offline mode will be ready after this page finishes loading once.';
      });
  };

  $('historyBtn').onclick = showHistory;
  function showHistory() {
    var now = new Date(), m = now.getMonth(), y = now.getFullYear();
    var month = history.filter(function (h) { var d = new Date(h.date); return d.getMonth() === m && d.getFullYear() === y; })
      .reduce(function (s, h) { return s + h.total; }, 0);
    var body = history.length ? '<p class="muted">This month: <b>' + money(month) + '</b> over ' + history.filter(function (h) { var d = new Date(h.date); return d.getMonth() === m && d.getFullYear() === y; }).length + ' trip(s)</p><ul class="hist">' +
      history.slice().reverse().map(function (h, i) {
        var d = new Date(h.date);
        return '<li><div><div>' + esc(h.store || 'Grocery trip') + '</div><div class="h-meta">' + d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + fmtQty(h.count) + ' items' + (h.budget ? ' · budget ' + money(h.budget) : '') + '</div></div>' +
          '<div style="display:flex;gap:8px;align-items:center"><span class="h-total">' + money(h.total) + '</span><button class="icon-btn" data-del="' + (history.length - 1 - i) + '" aria-label="Delete trip">🗑️</button></div></li>';
      }).join('') + '</ul><div class="stack" style="margin-top:12px"><button class="btn ghost" id="hCsv">⬇️ Download CSV</button></div>'
      : '<p class="muted">No trips saved yet. Tap “Finish trip” at checkout to save the total.</p>';
    openDlg('Trip history', body, function (root) {
      root.querySelectorAll('[data-del]').forEach(function (b) {
        b.onclick = function () { if (confirm('Delete this trip from history?')) { history.splice(+b.dataset.del, 1); save(); showHistory(); } };
      });
      var csv = root.querySelector('#hCsv');
      if (csv) csv.onclick = function () {
        var rows = [['date', 'store', 'items', 'subtotal', 'tax', 'total', 'budget']].concat(history.map(function (h) { return [h.date, h.store || '', h.count, h.subtotal, h.tax, h.total, h.budget || '']; }));
        var text = rows.map(function (r) { return r.map(function (c) { c = String(c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\n');
        var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
        a.download = 'tamayo-cart-history.csv'; document.body.appendChild(a); a.click(); a.remove();
      };
    });
  }

  $('finishBtn').onclick = function () {
    if (!state.items.length) { toast('Cart is empty'); return; }
    var t = totals();
    state.store = $('store').value.trim();
    if (!confirm('Save this trip (' + money(t.total) + (state.store ? ' at ' + state.store : '') + ') to history and empty the cart?')) return;
    history.push({ date: new Date().toISOString(), store: state.store, total: t.total, subtotal: t.subtotal, tax: t.tax, count: t.count, budget: state.budget || 0 });
    Plan.sync(plan, state.items); Plan.markBought(plan); // checked-off list items keep their real prices
    state.items = []; state.store = '';
    save(); render(); toast('Trip saved: ' + money(t.total));
  };
  $('clearBtn').onclick = function () {
    if (!state.items.length) return;
    snapshot(); state.items = []; save(); render(); toast('Cart cleared', { label: 'Undo', fn: undo });
  };
  $('addBtn').onclick = function () { openSheet({ mode: 'add' }); };

  // ---------------- OCR ----------------
  var workerP = null;
  function abs(p) { return new URL(p, location.href).href; }
  function getWorker() {
    if (workerP) return workerP;
    if (!window.Tesseract) {
      workerP = new Promise(function (res, rej) {
        var s = document.createElement('script'); s.src = 'vendor/tesseract/tesseract.min.js';
        s.onload = res; s.onerror = function () { rej(new Error('Could not load OCR engine')); }; document.head.appendChild(s);
      }).then(makeWorker);
    } else workerP = makeWorker();
    workerP.catch(function () { workerP = null; });
    return workerP;
  }
  function makeWorker() {
    return Tesseract.createWorker('eng', 1 /* LSTM only */, {
      workerPath: abs('vendor/tesseract/worker.min.js'),
      corePath: abs('vendor/tesseract/core'),
      langPath: abs('vendor/tesseract/lang'),
      gzip: true, workerBlobURL: false, cacheMethod: 'none',
      logger: function (m) { if (m.status && /loading/.test(m.status)) setCamStatus('Loading reader… ' + Math.round((m.progress || 0) * 100) + '%'); }
    }).then(function (w) {
      return w.setParameters({ tessedit_pageseg_mode: '11', preserve_interword_spaces: '1', user_defined_dpi: '300' }).then(function () { return w; });
    });
  }
  window.TamayoOCR = { getWorker: getWorker, readTag: readTag, preprocess: preprocess }; // exposed for tests

  // Grayscale + contrast stretch + scale; optional invert. Returns a canvas.
  function preprocess(src, invert) {
    var sw = src.width, sh = src.height;
    var target = Math.max(900, Math.min(1600, sw));
    var scale = target / sw;
    var c = document.createElement('canvas');
    c.width = Math.round(sw * scale); c.height = Math.round(sh * scale);
    var g = c.getContext('2d', { willReadFrequently: true });
    g.imageSmoothingQuality = 'high';
    g.drawImage(src, 0, 0, c.width, c.height);
    var img = g.getImageData(0, 0, c.width, c.height), d = img.data, n = d.length / 4;
    var hist = new Uint32Array(256), lum = new Uint8ClampedArray(n);
    for (var i = 0; i < n; i++) {
      var r = d[i * 4], gg = d[i * 4 + 1], b = d[i * 4 + 2];
      // use the darkest channel blend: helps red/yellow sale tags where text is dark on colour
      var L = 0.299 * r + 0.587 * gg + 0.114 * b;
      var mn = Math.min(r, gg, b);
      var v = (L * 0.6 + mn * 0.4) | 0;
      lum[i] = v; hist[v]++;
    }
    var lo = 0, hi = 255, acc = 0, cut = n * 0.02;
    for (lo = 0; lo < 255 && (acc += hist[lo]) < cut; lo++);
    acc = 0; for (hi = 255; hi > 0 && (acc += hist[hi]) < cut; hi--);
    var range = Math.max(1, hi - lo);
    for (i = 0; i < n; i++) {
      var s = (lum[i] - lo) * 255 / range; s = s < 0 ? 0 : s > 255 ? 255 : s;
      if (invert) s = 255 - s;
      d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = s; d[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  function meanLum(c) {
    var g = c.getContext('2d', { willReadFrequently: true }), d = g.getImageData(0, 0, c.width, c.height).data, s = 0, k = 0;
    for (var i = 0; i < d.length; i += 64) { s += d[i]; k++; }
    return s / k;
  }
  function linesFrom(data) {
    var lines = (data.lines || []).map(function (l) { return { text: l.text.replace(/\n/g, ' ').trim(), height: l.bbox ? l.bbox.y1 - l.bbox.y0 : 0 }; }).filter(function (l) { return l.text; });
    if (!lines.length && data.text) lines = data.text.split('\n').map(function (t) { return { text: t, height: 0 }; });
    return lines;
  }
  // Read a price tag from a canvas. Tries a couple of passes and keeps the most confident.
  function readTag(canvas) {
    return getWorker().then(function (w) {
      var pre = preprocess(canvas, false);
      var dark = meanLum(pre) < 110;
      var passes = dark ? [[true, '11'], [false, '11'], [true, '6']] : [[false, '11'], [false, '6'], [true, '11']];
      var best = null, allLines = [];
      function run(k) {
        if (k >= passes.length) return Promise.resolve();
        var img = k === 0 && !passes[0][0] ? pre : preprocess(canvas, passes[k][0]);
        return w.setParameters({ tessedit_pageseg_mode: passes[k][1] }).then(function () { return w.recognize(img); }).then(function (r) {
          var lines = linesFrom(r.data);
          allLines = allLines.concat(lines);
          var p = Core.parsePrice(lines);
          var top = p.candidates[0];
          if (p.price != null && (!best || top.score > best.candidates[0].score)) { best = p; best.lines = lines; best.text = r.data.text; }
          if (best && best.candidates[0].score >= 9) return; // confident enough
          return run(k + 1);
        });
      }
      return run(0).then(function () {
        var out = best || { price: null, candidates: [], note: 'No price found', text: '' };
        out.name = Core.guessName(allLines);
        return out;
      });
    });
  }

  // ---------------- camera ----------------
  var stream = null, track = null, torchOn = false, busy = false;
  function setCamStatus(t) { $('camStatus').innerHTML = t || ''; }
  function openCamera() {
    $('camera').hidden = false; setCamStatus('Starting camera…');
    getWorker().then(function () { if (!busy) setCamStatus('Hold steady, avoid glare, then tap the green button'); }).catch(function (e) { setCamStatus('OCR failed to load: ' + esc(e.message)); });
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { setCamStatus('Live camera not available here — tap 🖼️ to take a photo instead.'); return; }
    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } })
      .then(function (s) {
        stream = s; track = s.getVideoTracks()[0];
        var v = $('video'); v.srcObject = s; v.play().catch(function () {});
        try {
          var caps = track.getCapabilities ? track.getCapabilities() : {};
          $('torchBtn').hidden = !caps.torch;
          if (caps.focusMode && caps.focusMode.indexOf('continuous') >= 0) track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }).catch(function () {});
        } catch (e) {}
        if (window.Tesseract && workerP) setCamStatus('Hold steady, avoid glare, then tap the green button');
      })
      .catch(function (err) {
        setCamStatus((err && err.name === 'NotAllowedError' ? 'Camera permission denied. ' : 'Camera unavailable (needs HTTPS). ') + 'Tap 🖼️ to take a photo instead.');
      });
  }
  function stopCamera() {
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    stream = null; track = null; torchOn = false; $('video').srcObject = null; $('camera').hidden = true;
  }
  $('scanBtn').onclick = function () { pendingListId = null; openCamera(); };
  $('camClose').onclick = function () { stopCamera(); pendingListId = null; };
  $('torchBtn').onclick = function () { if (!track) return; torchOn = !torchOn; track.applyConstraints({ advanced: [{ torch: torchOn }] }).catch(function () {}); };

  // Crop the visible guide box out of the (object-fit: cover) video frame.
  function grabGuide() {
    var v = $('video'), vw = v.videoWidth, vh = v.videoHeight;
    if (!vw) return null;
    var vr = v.getBoundingClientRect(), gr = $('guideBox').getBoundingClientRect();
    var scale = Math.max(vr.width / vw, vr.height / vh);
    var dispW = vw * scale, dispH = vh * scale;
    var offX = (vr.width - dispW) / 2, offY = (vr.height - dispH) / 2;
    var pad = 0.06;
    var x = (gr.left - vr.left - offX) / scale, y = (gr.top - vr.top - offY) / scale;
    var w = gr.width / scale, h = gr.height / scale;
    x -= w * pad; y -= h * pad; w *= 1 + 2 * pad; h *= 1 + 2 * pad;
    x = Math.max(0, x); y = Math.max(0, y); w = Math.min(vw - x, w); h = Math.min(vh - y, h);
    var c = document.createElement('canvas'); c.width = Math.round(w); c.height = Math.round(h);
    c.getContext('2d').drawImage(v, x, y, w, h, 0, 0, c.width, c.height);
    return c;
  }
  function processCanvas(c) {
    busy = true; $('shutter').disabled = true;
    setCamStatus('<span class="spinner"></span>Reading price…');
    var thumb = c.toDataURL('image/jpeg', 0.7);
    return readTag(c).then(function (r) {
      stopCamera();
      buzz(30);
      openSheet({ mode: 'add', listId: pendingListId, ocr: { price: r.price, note: r.note, candidates: r.candidates, name: r.name, img: thumb, multiQty: r.multiQty, multiTotal: r.multiTotal, perWeight: r.perWeight } });
    }).catch(function (e) {
      stopCamera(); toast('Could not read: ' + e.message);
      openSheet({ mode: 'add', listId: pendingListId });
    }).then(function () { busy = false; $('shutter').disabled = false; });
  }
  $('shutter').onclick = function () {
    if (busy) return;
    var c = grabGuide();
    if (!c) { toast('Camera not ready — or tap 🖼️ to use a photo'); return; }
    processCanvas(c);
  };
  $('fileInput').addEventListener('change', function () {
    var f = this.files && this.files[0]; this.value = '';
    if (!f) return;
    var url = URL.createObjectURL(f), img = new Image();
    img.onload = function () {
      var max = 2000, s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      var c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      $('camera').hidden = false; processCanvas(c);
    };
    img.onerror = function () { toast('Could not open that image'); };
    img.src = url;
  });

  // ---------------- meal plan / shopping list view ----------------
  var pendingListId = null;
  function setView(v) {
    state.view = v === 'plan' ? 'plan' : 'cart';
    $('cartView').hidden = state.view !== 'cart'; $('planView').hidden = state.view !== 'plan';
    ['tabCart', 'tabPlan'].forEach(function (id) { var on = $(id).dataset.view === state.view; $(id).classList.toggle('on', on); $(id).setAttribute('aria-selected', on); });
    $('addBtn').innerHTML = '＋ Type price';
  }
  $('tabCart').onclick = function () { setView('cart'); save(); window.scrollTo(0, 0); };
  $('tabPlan').onclick = function () { setView('plan'); save(); renderPlan(); window.scrollTo(0, 0); };
  $('weekSeg').addEventListener('click', function (e) {
    var b = e.target.closest('[data-week]'); if (!b) return;
    plan.week = b.dataset.week; save(); renderPlan(); buzz();
  });

  var expandedDinners = {};
  function renderPlan() {
    var wk = Meals.weeks[plan.week], items = curItems(), s = Plan.summary(items), t = totals();
    Array.prototype.forEach.call($('weekSeg').children, function (b) { var on = b.dataset.week === plan.week; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    var projected = Core.round2(t.total + s.remaining);
    var level = !state.budget ? 'none' : projected > state.budget ? 'over' : projected >= 0.9 * state.budget ? 'warn' : 'ok';
    var pct = s.total ? Math.round(s.checked / s.total * 100) : 0;
    $('planStats').dataset.level = level;
    $('planStats').innerHTML =
      '<div class="ps-row"><div><div class="label">Estimated remaining</div><div class="ps-big" id="planRemaining">' + money(s.remaining) + '</div>' +
      '<div class="sub">' + s.left + ' item' + (s.left === 1 ? '' : 's') + ' left' + (s.leftNoPrice ? ' (' + s.leftNoPrice + ' to check at home)' : '') + '</div></div>' +
      '<div class="ps-right"><div class="label">Scanned</div><div class="ps-mid" id="planScanned">' + money(s.scanned) + '</div><div class="sub">' + s.scannedCount + ' list item' + (s.scannedCount === 1 ? '' : 's') + '</div></div></div>' +
      '<div class="bar" role="progressbar" aria-label="List checked off" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><div class="fill" style="width:' + pct + '%"></div></div>' +
      '<div class="bar-caption" id="planCaption">' + s.checked + ' of ' + s.total + ' checked · list estimate ' + money(s.estTotal) +
      (state.budget ? '<br>Cart ' + money(t.total) + ' + est. remaining ' + money(s.remaining) + ' ≈ <b>' + money(projected) + '</b> of ' + money(state.budget) + ' budget' : '') + '</div>';
    $('dinners').innerHTML = wk.dinners.map(function (d, i) {
      var recipe = dinnerRecipe(d, plan.week);
      var open = !!expandedDinners[plan.week + ':' + i];
      var has = !!recipe;
      return '<li class="dinner-wrap' + (open ? ' open' : '') + '">' +
        '<button type="button" class="dinner" data-i="' + i + '"' + (has ? ' aria-expanded="' + open + '"' : ' data-nometa="1"') + '>' +
        '<span class="day">' + esc(d.day) + '</span><span class="dn"><span class="dt">' + esc(d.title) + '</span>' +
        (d.detail ? '<span class="dd">' + esc(d.detail) + '</span>' : '') + '</span>' +
        (has ? '<span class="chev" aria-hidden="true">›</span>' : '') + '</button>' +
        (has ? '<div class="recipe-panel" data-recipe-i="' + i + '"' + (open ? '' : ' hidden') + '>' + renderRecipeHtml(recipe) + '</div>' : '') +
        '</li>';
    }).join('');
    $('planList').innerHTML = Plan.groupBySection(Meals, items).map(function (g) {
      return '<section class="plan-sec"><h3 class="sec-h"><span>' + g.icon + ' ' + esc(g.label) + '</span>' + (g.est ? '<span class="sec-est">~' + money(g.est) + '</span>' : '') + '</h3><ul class="plist">' +
        g.items.map(function (it) {
          var price = it.price != null ? '<span class="real">' + money(it.price) + '</span><small>scanned</small>'
            : it.checked ? '<small>✓ got it</small>'
            : it.est != null ? '<span>~' + money(it.est) + '</span><small>est.</small>' : '<small>check</small>';
          return '<li class="pitem' + (it.checked ? ' done' : '') + '" data-id="' + esc(it.id) + '">' +
            '<button class="pcheck" data-act="check" role="checkbox" aria-checked="' + it.checked + '" aria-label="Check off ' + esc(it.name) + '"><span aria-hidden="true">✓</span></button>' +
            '<button class="pinfo" data-act="menu"><span class="pname">' + esc(it.name) + (it.custom ? ' <span class="tag">ADDED</span>' : '') + '</span>' +
            '<span class="pmeta">' + esc(it.qty || '') + '</span></button>' +
            '<button class="pprice" data-act="menu" aria-label="Options">' + price + '</button></li>';
        }).join('') + '</ul></section>';
    }).join('') || '<div class="empty"><p class="big">List is empty</p><p>Tap <b>Add item</b> or <b>Reset week</b>.</p></div>';
    $('planNote').textContent = wk.note;
    var nRemoved = Object.keys(plan.weeks[plan.week].removed).length;
    $('planRestoreBtn').hidden = !nRemoved;
    $('planRestoreBtn').textContent = '↩︎ Restore ' + nRemoved + ' removed item' + (nRemoved === 1 ? '' : 's');
  }

  function dinnerRecipe(d, week) {
    if (!d) return null;
    if (d.meal && Recipes && Recipes.byMeal && Recipes.byMeal[d.meal]) return Recipes.byMeal[d.meal];
    if (!d.meal && Recipes && Recipes.sundayByWeek && Recipes.sundayByWeek[week]) return Recipes.sundayByWeek[week];
    return null;
  }
  function renderRecipeHtml(r) {
    var meta = '<div class="recipe-meta">' +
      '<div><b>Servings</b>' + esc(r.servings) + '</div>' +
      '<div><b>Equipment</b>' + esc(r.equipment) + '</div>' +
      '<div><b>Prep</b>' + esc(r.prep) + '</div>' +
      '<div><b>Cook</b>' + esc(r.cook) + '</div></div>';
    var ings = '<div class="recipe-sec">Ingredients</div><ul class="recipe-list">' +
      (r.ingredients || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    var steps = '<div class="recipe-sec">Steps</div><ol class="recipe-steps">' +
      (r.steps || []).map(function (s) {
        if (typeof s === 'string') return '<li>' + esc(s) + '</li>';
        return '<li><b>' + esc(s.title) + '.</b> ' + esc(s.detail || '') + '</li>';
      }).join('') + '</ol>';
    var done = r.doneness ? '<div class="recipe-sec">Doneness &amp; safety</div><p class="recipe-note">' + esc(r.doneness) + '</p>' : '';
    var tip = r.tip ? '<p class="recipe-tip"><b>Tip:</b> ' + esc(r.tip) + '</p>' : '';
    return '<div class="recipe-h">How to make it</div>' + meta + ings + steps + done + tip;
  }
  $('dinners').addEventListener('click', function (e) {
    var b = e.target.closest('.dinner'); if (!b || b.hasAttribute('data-nometa')) return;
    var i = +b.dataset.i, key = plan.week + ':' + i;
    expandedDinners[key] = !expandedDinners[key];
    renderPlan();
    if (expandedDinners[key]) {
      var panel = $('dinners').querySelector('[data-recipe-i="' + i + '"]');
      if (panel) try { panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (err) {}
    }
  });

  $('planList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var li = e.target.closest('.pitem'), id = li.dataset.id;
    var it = curItems().find(function (x) { return x.id === id; }); if (!it) return;
    if (b.dataset.act === 'check') toggleItem(it);
    else itemMenu(it);
  });
  function toggleItem(it) {
    var r = Plan.toggle(plan, plan.week, it.id); buzz();
    save(); render();
    if (!r.checked && r.was && r.was.cartId != null && state.items.some(function (c) { return c.id === r.was.cartId; })) {
      var cid = r.was.cartId;
      toast('Unchecked — still in cart', { label: 'Remove from cart', fn: function () { snapshot(); state.items = state.items.filter(function (c) { return c.id !== cid; }); save(); render(); } });
    }
  }
  function itemMenu(it) {
    var meals = (it.for || []).map(function (id) { var m = Meals.meals.find(function (x) { return x.id === id; }); return m ? m.name : ''; }).filter(Boolean);
    var info = '<p class="muted">' + esc(it.qty || '') + (it.est != null ? ' · about ' + money(it.est) + (it.basis ? ' (estimate: ' + esc(it.basis) + ')' : ' (estimate)') : '') + '</p>' +
      (meals.length ? '<p class="muted">For: ' + esc(meals.join(', ')) + '</p>' : '') +
      (it.price != null ? '<p>✓ Scanned: <b>' + money(it.price) + '</b>' + (it.bought ? ' (finished trip)' : '') + '</p>' : '');
    openDlg(it.name, '<div class="stack">' + info +
      '<button class="btn primary xl" id="mScan">📷 Scan price for this</button>' +
      '<button class="btn secondary" id="mType">＋ Type price for this</button>' +
      (it.linked && state.items.some(function (c) { return c.id === it.cartId; }) ? '<button class="btn ghost" id="mCart">✏️ Edit cart line</button>' : '') +
      '<button class="btn ghost" id="mCheck">' + (it.checked ? '↩︎ Uncheck' : '✓ Check off (no price)') + '</button>' +
      '<button class="btn ghost danger" id="mDel">🗑️ Remove from list</button></div>', function (root) {
      root.querySelector('#mScan').onclick = function () { closeDlg(); pendingListId = it.id; openCamera(); };
      root.querySelector('#mType').onclick = function () { closeDlg(); openSheet({ mode: 'add', listId: it.id }); };
      var mc = root.querySelector('#mCart'); if (mc) mc.onclick = function () { closeDlg(); openSheet({ mode: 'edit', item: state.items.find(function (c) { return c.id === it.cartId; }) }); };
      root.querySelector('#mCheck').onclick = function () { closeDlg(); toggleItem(it); };
      root.querySelector('#mDel').onclick = function () {
        closeDlg(); snapshot(); Plan.removeItem(plan, plan.week, it.id); save(); render();
        toast('Removed ' + it.name, { label: 'Undo', fn: undo });
      };
    });
  }
  $('planAddBtn').onclick = function () {
    openDlg('Add to ' + Meals.weeks[plan.week].label + ' list',
      '<div class="stack"><label class="field"><span>Item</span><input id="aName" maxlength="60" placeholder="e.g. Dog food, paper towels" enterkeyhint="next"></label>' +
      '<label class="field"><span>Quantity (optional)</span><input id="aQty" maxlength="40" placeholder="e.g. 30 lb bag"></label>' +
      '<label class="field"><span>Aisle / section</span><select id="aSec" class="select">' + Meals.sections.filter(function (x) { return x.id !== 'check'; }).map(function (x) { return '<option value="' + x.id + '"' + (x.id === 'household' ? ' selected' : '') + '>' + x.icon + ' ' + esc(x.label) + '</option>'; }).join('') + '</select></label>' +
      '<label class="field"><span>Estimated price (optional)</span><div class="price-input"><span>$</span><input id="aEst" inputmode="decimal" placeholder="0.00"></div></label>' +
      '<button class="btn primary xl" id="aSave">Add to list</button></div>', function (root) {
      setTimeout(function () { root.querySelector('#aName').focus(); }, 60);
      root.querySelector('#aSave').onclick = function () {
        var item = Plan.addCustom(plan, plan.week, { name: root.querySelector('#aName').value, qty: root.querySelector('#aQty').value, section: root.querySelector('#aSec').value, est: num(root.querySelector('#aEst').value) });
        if (!item) { toast('Type an item name'); return; }
        save(); render(); closeDlg(); toast('Added ' + item.name + ' to the list');
      };
    });
  };
  $('planResetBtn').onclick = function () {
    var label = Meals.weeks[plan.week].label;
    if (!confirm('Reset ' + label + '? This unchecks everything, brings back removed items and deletes items you added. Your cart is not changed.')) return;
    snapshot(); Plan.resetWeek(plan, plan.week); save(); render(); toast(label + ' reset', { label: 'Undo', fn: undo });
  };
  $('planRestoreBtn').onclick = function () { plan.weeks[plan.week].removed = {}; save(); render(); };

  // ---------------- boot ----------------
  applyTheme(); setView(state.view); render();
  document.addEventListener('visibilitychange', function () { if (document.hidden && stream) stopCamera(); });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    var hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      reg.addEventListener('updatefound', function () {
        var nw = reg.installing; if (!nw) return;
        nw.addEventListener('statechange', function () { if (nw.state === 'activated' && !hadController) toast('✓ Ready to work offline'); });
      });
    }).catch(function () {});
  }
})();
