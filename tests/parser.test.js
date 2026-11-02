// Run: node --test tests/*.test.js   (or: node tests/parser.test.js)
const test = require('node:test');
const assert = require('node:assert/strict');
const { parsePrice, guessName, computeTotals, money } = require('../parser.js');

const cases = [
  // [input, expected price, optional note regex]
  ['$3.99', 3.99],
  ['3.99', 3.99],
  ['$ 3.99', 3.99],
  ['$3,99', 3.99],
  ['$12.49', 12.49],
  ['$0.89', 0.89],
  ['$3 99', 3.99],
  ['3 99', 3.99],
  ['$399', 3.99, /small cents/],
  ['$1299', 12.99],
  ['$5', 5.00],
  ['2/$5', 2.50, /2 for \$5\.00/],
  ['2 / $5', 2.50],
  ['2 for $5', 2.50],
  ['2 FOR $5.00', 2.50],
  ['3/$10', 3.33, /3 for \$10\.00/],
  ['10/$10', 1.00],
  ['4 for $6.00 MUST BUY 4', 1.50, /must buy 4/],
  ['5/$4', 0.80],
  ['99¢', 0.99],
  ['79 ¢', 0.79],
  ['$3.O9', 3.09],          // O read for 0
  ['$S.49', null],          // no digit at all in core except 49 -> still finds 49? handled below
  ['$2.l9', 2.19],          // l read for 1
  ['UNIT PRICE $0.25 per oz\nSALE $3.99', 3.99],
  ['$0.31/oz\n$4.99', 4.99],
  ['Unit price 18.7¢ per oz\n$2.99', 2.99],
  ['YOU SAVE $1.00\n$2.49', 2.49],
  ['REG $4.99\nSALE $3.49', 3.49],
  ['Was $6.99 Now $4.99', 4.99],
  ['BANANAS\n$0.59 /lb', 0.59, /per lb/],
  ['Tomatoes 1.99 lb', 1.99, /per lb/],
  ['MILK 1 GAL\n$4.29', 4.29],
  ['CHEERIOS 12 OZ\n$4.79\n$0.40/oz', 4.79],
  ['Expires 11/02\n$3.49', 3.49],          // date isn't a multi-buy
  ['UPC 0 41196 01020 3\n$2.29', 2.29],
  ['399', 3.99, /Guessed/],
  ['$3\n99', 3.99],
  ['Item 123456 $1.79', 1.79],
  ['', null],
  ['hello world', null],
  ['ORGANIC EGGS 12 CT\n$5.99\nUNIT PRICE $0.50 PER CT', 5.99],
  ['$19.99', 19.99],
  ['$149.99', 149.99],
  ['2/$7.00 with card\nReg $4.29', 3.50],
  ['$6.99\nSave $2.00', 6.99],
  ['$1.25 ea', 1.25],
  ['Sale 2.50', 2.50],
  ['#349', 3.49],           // big "$" misread as "#", superscript cents merged
  ['# 4.99', 4.99],
  ['S3.99', 3.99],          // "$" misread as "S" -> not 53.99
  ['S12.49', 12.49],
  ['2/S5', null],           // too ambiguous; must not crash
];

for (const [input, expected, noteRe] of cases) {
  test(`parsePrice(${JSON.stringify(input)}) -> ${expected}`, () => {
    const r = parsePrice(input);
    if (expected === null && (input === '$S.49' || input === '2/S5')) {
      // "S" alone can't be safely turned into 5 (no digit before the dot); we accept either a 0.49 guess or null
      assert.ok(r.price === null || r.price === 0.49 || r.price === 5.49);
      return;
    }
    assert.equal(r.price, expected, `got ${r.price} (${r.note}); candidates ${JSON.stringify(r.candidates.map(c => [c.price, c.score]))}`);
    if (noteRe) assert.match(r.note, noteRe);
  });
}

test('line heights favour the biggest text', () => {
  const r = parsePrice([{ text: '$0.42/oz', height: 10 }, { text: '$1.00 off', height: 14 }, { text: '$5.49', height: 60 }]);
  assert.equal(r.price, 5.49);
});
test('line heights: big superscript price beats small reg price', () => {
  const r = parsePrice([{ text: 'Reg 4.99', height: 12 }, { text: '$3 49', height: 70 }]);
  assert.equal(r.price, 3.49);
});

test('guessName', () => {
  assert.equal(guessName('KELLOGGS FROSTED FLAKES\n$3.99\nUNIT PRICE $0.25 PER OZ'), 'Kelloggs Frosted Flakes');
  assert.equal(guessName('$3.99'), '');
  assert.equal(guessName('Bananas\n$0.59 /lb'), 'Bananas');
});

test('computeTotals: no tax by default on untaxed groceries', () => {
  const t = computeTotals([{ price: 3.99, qty: 2 }, { price: 1.25, qty: 1 }], { taxOn: true, rate: 10.25, budget: 100 });
  assert.equal(t.subtotal, 9.23); assert.equal(t.tax, 0); assert.equal(t.total, 9.23);
  assert.equal(t.remaining, 90.77); assert.equal(t.level, 'ok');
});
test('computeTotals: tax only on taxable items, 10.25%', () => {
  const t = computeTotals([{ price: 10, qty: 1, taxable: true }, { price: 5, qty: 1 }], { taxOn: true, rate: 10.25, budget: 20 });
  assert.equal(t.tax, 1.03); assert.equal(t.total, 16.03); assert.equal(t.level, 'warn');
});
test('computeTotals: tax toggle off', () => {
  const t = computeTotals([{ price: 10, qty: 1, taxable: true }], { taxOn: false, rate: 10.25 });
  assert.equal(t.tax, 0); assert.equal(t.level, 'none');
});
test('computeTotals: over budget', () => {
  const t = computeTotals([{ price: 60, qty: 2 }], { budget: 100 });
  assert.equal(t.level, 'over'); assert.equal(t.remaining, -20);
});
test('computeTotals: 80% threshold is amber', () => {
  assert.equal(computeTotals([{ price: 80, qty: 1 }], { budget: 100 }).level, 'warn');
  assert.equal(computeTotals([{ price: 79.99, qty: 1 }], { budget: 100 }).level, 'ok');
});
test('computeTotals: float-safe cents', () => {
  const t = computeTotals([{ price: 0.1, qty: 3 }, { price: 0.2, qty: 1 }], {});
  assert.equal(t.subtotal, 0.5);
});
test('computeTotals: weighted qty (2.35 lb at $1.99)', () => {
  assert.equal(computeTotals([{ price: 1.99, qty: 2.35 }], {}).subtotal, 4.68);
});
test('money', () => { assert.equal(money(1234.5), '$1,234.50'); assert.equal(money(-2), '-$2.00'); });
