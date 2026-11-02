/* Tamayo Cart — price-tag text parser + cart math.
 * Pure functions, no DOM. Works in the browser (window.TamayoCore) and Node (require). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TamayoCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- helpers ----------
  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function toCents(n) { return Math.round(Number(n) * 100); }
  function money(n) {
    var v = Number(n) || 0, neg = v < 0; v = Math.abs(v);
    return (neg ? '-$' : '$') + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Fix common OCR confusions inside tokens that are clearly meant to be numbers.
  function fixToken(tok) {
    // Only touch tokens that contain a digit (or a $) plus look-alike letters.
    if (!/[\d$]/.test(tok)) return tok;
    if (!/^[$]?[\dOoQDSsIl|BZz]+([.,:][\dOoQDSsIl|BZz]{1,2})?[¢c]?$/.test(tok)) return tok;
    var core = tok.replace(/[¢c]$/, '');
    var tail = tok.length > core.length ? tok.slice(core.length) : '';
    // require at least one real digit so plain words ("Sol", "lb") are left alone
    if (!/\d/.test(core)) return tok;
    core = core.replace(/[OoQD]/g, '0').replace(/[Ss]/g, '5').replace(/[Il|]/g, '1')
               .replace(/B/g, '8').replace(/[Zz]/g, '2').replace(/:/g, '.');
    return core + tail;
  }

  function normalizeLine(s) {
    s = String(s || '')
      .replace(/[＄﹩]/g, '$')
      .replace(/[\u2009\u00a0\u202f]/g, ' ')
      .replace(/[‘’`´]/g, "'")
      .replace(/[—–]/g, '-')
      .replace(/(\d)\s*[,]\s*(\d{2})(?!\d)/g, '$1.$2')      // 3,99 -> 3.99
      .replace(/\$\s+/g, '$')                                 // "$ 3.99" -> "$3.99"
      .replace(/(^|[^\w])[#§](\s*\d)/g, '$1$$$2')                // OCR often reads a big "$" as "#" or "§"
      .replace(/(^|\s)[Ss](\d{1,3}\.\d{2})(?!\d)/g, '$1$$$2')       // "S3.99" -> "$3.99" (not 53.99)
      .replace(/(\d)\s*\.\s+(\d{2})(?!\d)/g, '$1.$2')         // "3. 99" -> "3.99"
      .replace(/[“”"]/g, ' ');
    return s.split(/(\s+)/).map(function (t) { return /\s/.test(t) ? t : fixToken(t); }).join('');
  }

  var UNIT_RE = /^\s*(?:\/|per\s+|a\s+)?\s*(fl\.?\s*oz|oz|ounce|lb|lbs|pound|kg|g|ct|count|ea|each|qt|pt|gal|l|ml|100|sq\s*ft|load|roll|sheet|pk)\b/i;
  var SMALL_UNITS = /^(fl\.?\s*oz|oz|ounce|g|ml|ct|count|100|sq\s*ft|load|roll|sheet|qt|pt|l)$/i;
  var WEIGHT_UNITS = /^(lb|lbs|pound|kg)$/i;

  function contextScore(line, idx, matchLen, out) {
    var lower = line.toLowerCase();
    var before = lower.slice(Math.max(0, idx - 18), idx);
    var after = lower.slice(idx + matchLen, idx + matchLen + 14);
    var s = 0;
    var u = UNIT_RE.exec(after);
    if (u) {
      var unit = u[1].replace(/\s+/g, ' ');
      if (SMALL_UNITS.test(unit)) { s -= 6; out.unit = unit; out.isUnitPrice = true; }
      else if (WEIGHT_UNITS.test(unit)) { s += 0.5; out.unit = 'lb'; out.perWeight = true; if (/kg/.test(unit)) out.unit = 'kg'; }
      else if (/^(ea|each)$/.test(unit)) { s += 0.5; }
    }
    if (/unit\s*price|price\s*per|per\s*(oz|ounce|100|ct|count|fl)/.test(lower)) { s -= 6; out.isUnitPrice = true; }
    if (/save|savings|you\s*save|\boff\b/.test(before) || /^\s*off\b/.test(after)) { s -= 7; out.isSavings = true; }
    if (/\b(reg|regular|was|orig|retail|compare)\b\.?\s*(price)?\s*:?\s*$/.test(before) || /\b(reg|regular|was)\b/.test(lower) && !/sale|now|only/.test(lower)) { s -= 3; out.isRegular = true; }
    if (/\b(sale|now|only|member|card|club|special|deal|price)\b/.test(before)) s += 1;
    return s;
  }

  // Extract all price candidates from one normalized line.
  function lineCandidates(raw, lineIndex, height, maxH) {
    var line = normalizeLine(raw);
    var cands = [];
    var taken = []; // [start,end) spans already consumed
    function free(a, b) { for (var i = 0; i < taken.length; i++) if (a < taken[i][1] && b > taken[i][0]) return false; return true; }
    function push(m, price, base, extra) {
      var c = Object.assign({ price: round2(price), score: base, text: m[0].trim(), line: raw, lineIndex: lineIndex }, extra || {});
      c.score += contextScore(line, m.index, m[0].length, c);
      if (maxH && height) c.score += 4 * (height / maxH);
      if (c.price < 0.05 || c.price > 999) return;
      if (c.price > 300) c.score -= 2;
      taken.push([m.index, m.index + m[0].length]);
      cands.push(c);
    }
    var m, re;

    // 1) Multi-buy: "2/$5", "2 for $5", "3 FOR 10.00", "10/$10"
    re = /(?:^|[^\d.])(\d{1,2})\s*(\/|for\b|f0r\b)\s*(\$?)(\d{1,3})(?:\.(\d{2}))?(?![\d.\/])/gi;
    while ((m = re.exec(line))) {
      var qty = parseInt(m[1], 10);
      var hasFor = /for|f0r/i.test(m[2]), hasDollar = m[3] === '$', hasDec = m[5] != null;
      if (qty < 2 || qty > 20) continue;
      if (!(hasFor || hasDollar || hasDec)) continue; // avoids dates like 11/02
      var total = parseInt(m[4], 10) + (hasDec ? parseInt(m[5], 10) / 100 : 0);
      if (total <= 0) continue;
      var off = m[0].search(/\d/); var mm = { index: m.index + off, 0: m[0].slice(off) };
      var each = Math.round((total / qty) * 100) / 100;
      push(mm, each, 9, { multiQty: qty, multiTotal: round2(total),
        note: qty + ' for ' + money(total) + ' = ' + money(each) + ' each' + (/must\s*buy/i.test(line) ? ' (must buy ' + qty + ')' : '') });
    }

    // 2) Cents: "99¢", "79c"
    re = /(?:^|[^\d.$])(\d{1,2})\s*(¢|c\b)/g;
    while ((m = re.exec(line))) {
      var off2 = m[0].search(/\d/); var m2 = { index: m.index + off2, 0: m[0].slice(off2) };
      if (!free(m2.index, m2.index + m2[0].length)) continue;
      push(m2, parseInt(m[1], 10) / 100, m[2] === '¢' ? 6 : 2, { note: 'Read as cents' });
    }

    // 3) Decimal price: "$3.99", "3.99", "12.49"
    re = /(\$?)(\d{1,4})\.(\d{2})(?![\d])/g;
    while ((m = re.exec(line))) {
      if (!free(m.index, m.index + m[0].length)) continue;
      push(m, parseInt(m[2], 10) + parseInt(m[3], 10) / 100, m[1] ? 7 : 5);
    }

    // 4) Superscript cents read with a space: "$3 99", "3 99"
    re = /(\$?)(\d{1,3})\s+(\d{2})(?![\d.])/g;
    while ((m = re.exec(line))) {
      if (!free(m.index, m.index + m[0].length)) continue;
      // skip things that are obviously sizes/counts ("12 oz" handled by unit context) or long digit runs
      var pre = line.slice(Math.max(0, m.index - 1), m.index);
      if (/\d/.test(pre)) continue;
      var shortLine = line.replace(/[^\w$]/g, '').length <= m[0].replace(/\s/g, '').length + 3;
      push(m, parseInt(m[2], 10) + parseInt(m[3], 10) / 100, m[1] ? 7 : (shortLine ? 4 : 1), { note: m[1] || shortLine ? undefined : 'Guessed cents from "' + m[0].trim() + '"' });
    }

    // 5) "$" with no decimal: "$5" (whole dollars) or "$399" (cents merged)
    re = /\$(\d{1,4})(?![\d.])/g;
    while ((m = re.exec(line))) {
      if (!free(m.index, m.index + m[0].length)) continue;
      var d = m[1];
      if (d.length >= 3) push(m, parseInt(d.slice(0, -2), 10) + parseInt(d.slice(-2), 10) / 100, 6, { note: 'Read "' + m[0] + '" as ' + money(parseInt(d.slice(0, -2), 10) + parseInt(d.slice(-2), 10) / 100) + ' (small cents)' });
      else push(m, parseInt(d, 10), 5);
    }

    // 6) A bare 3-4 digit number alone on its line: "399" -> 3.99 (big tag, $ and dot lost)
    var bare = /^\s*(\d{3,4})\s*$/.exec(line);
    if (bare && free(bare.index, bare.index + bare[0].length)) {
      var dd = bare[1];
      var val = parseInt(dd.slice(0, -2), 10) + parseInt(dd.slice(-2), 10) / 100;
      push(bare, val, 3, { note: 'Guessed ' + money(val) + ' from "' + dd + '"' });
    }
    return cands;
  }

  /**
   * parsePrice(input)
   * input: string (OCR text, may be multi-line) OR array of {text, height}
   * returns { price, note, candidates[], unit, multiQty, multiTotal } or { price:null, candidates:[] }
   */
  function parsePrice(input) {
    var lines;
    if (Array.isArray(input)) lines = input.map(function (l) { return typeof l === 'string' ? { text: l } : l; });
    else lines = String(input || '').split(/\r?\n/).map(function (t) { return { text: t }; });
    lines = lines.filter(function (l) { return l.text && l.text.trim(); });
    var maxH = 0;
    lines.forEach(function (l) { if (l.height > maxH) maxH = l.height; });
    var cands = [];
    lines.forEach(function (l, i) { cands = cands.concat(lineCandidates(l.text, i, l.height, maxH)); });
    // Pair "$3" on one line with "99" alone on the next (superscript split across lines)
    for (var i = 0; i + 1 < lines.length; i++) {
      var a = /^\s*\$\s*(\d{1,3})\s*$/.exec(normalizeLine(lines[i].text));
      var b = /^\s*(\d{2})\s*$/.exec(normalizeLine(lines[i + 1].text));
      if (a && b) {
        cands = cands.filter(function (c) { return c.lineIndex !== i; });
        cands.push({ price: round2(parseInt(a[1], 10) + parseInt(b[1], 10) / 100), score: 8 + (maxH && lines[i].height ? 4 * lines[i].height / maxH : 0), text: a[0].trim() + ' ' + b[1], line: lines[i].text, lineIndex: i });
      }
    }
    cands.sort(function (x, y) { return y.score - x.score || y.price - x.price; });
    // de-duplicate by price, keep best
    var seen = {}, uniq = [];
    cands.forEach(function (c) { var k = c.price.toFixed(2); if (!seen[k]) { seen[k] = 1; uniq.push(c); } });
    if (!uniq.length) return { price: null, note: 'No price found', candidates: [] };
    var best = uniq[0];
    var notes = [];
    if (best.note) notes.push(best.note);
    if (best.perWeight) notes.push('Price is per ' + best.unit + ' — set qty to the weight');
    if (best.isUnitPrice) notes.push('This looks like a unit price — double-check');
    if (best.isSavings) notes.push('This looks like a savings amount — double-check');
    return {
      price: best.price, note: notes.join('. '), candidates: uniq,
      unit: best.unit || null, perWeight: !!best.perWeight,
      multiQty: best.multiQty || null, multiTotal: best.multiTotal || null
    };
  }

  // Guess a product name from OCR lines (longest mostly-letters line that isn't tag boilerplate)
  var STOP = /\b(unit|price|per|save|savings|reg|regular|sale|was|now|only|oz|lb|lbs|ct|each|ea|upc|sku|item|fl|card|member|club|total|retail|you|off|for|must|buy|limit|exp|ends|valid|thru|through|store)\b/gi;
  function guessName(input) {
    var lines = Array.isArray(input) ? input.map(function (l) { return typeof l === 'string' ? l : l.text; }) : String(input || '').split(/\r?\n/);
    var best = '', bestScore = 0;
    lines.forEach(function (raw) {
      var t = String(raw || '').replace(/[^A-Za-z0-9&' \-]/g, ' ').replace(/\s+/g, ' ').trim();
      var letters = (t.match(/[A-Za-z]/g) || []).length;
      var digits = (t.match(/\d/g) || []).length;
      if (letters < 4 || digits > letters) return;
      var stripped = t.replace(STOP, '').replace(/\b\d+\b/g, '').replace(/\s+/g, ' ').trim();
      var words = stripped.split(' ').filter(function (w) { return w.length >= 2 && /[aeiouy]/i.test(w); });
      if (!words.length) return;
      var score = words.join(' ').length;
      if (score > bestScore) { bestScore = score; best = words.join(' '); }
    });
    if (bestScore < 4) return '';
    best = best.slice(0, 40);
    return best.toLowerCase().replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
  }

  /** computeTotals(items, {taxOn, rate}) — all math in integer cents. */
  function computeTotals(items, opts) {
    opts = opts || {};
    var sub = 0, taxableSub = 0, count = 0;
    (items || []).forEach(function (it) {
      var line = Math.round(toCents(it.price) * (Number(it.qty) || 0));
      sub += line; count += it.perWeight ? 1 : (Number(it.qty) || 0);
      if (it.taxable) taxableSub += line;
    });
    var rate = Number(opts.rate) || 0;
    var tax = opts.taxOn ? Math.round(taxableSub * rate / 100) : 0;
    var total = sub + tax;
    var budget = toCents(opts.budget || 0);
    var res = { subtotal: sub / 100, taxableSubtotal: taxableSub / 100, tax: tax / 100, total: total / 100, count: round2(count) };
    if (budget > 0) {
      res.budget = budget / 100;
      res.remaining = (budget - total) / 100;
      res.pct = total / budget;
      res.level = total > budget ? 'over' : (total >= 0.8 * budget ? 'warn' : 'ok');
    } else { res.budget = 0; res.remaining = null; res.pct = 0; res.level = 'none'; }
    return res;
  }

  return { parsePrice: parsePrice, guessName: guessName, computeTotals: computeTotals, normalizeLine: normalizeLine, money: money, round2: round2 };
});
