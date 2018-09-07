const { expect } = require('code');
const { it, describe } = exports.lab = require('lab').script();
const arrayToCSV = require('../../lib/transforms/arrayToCSV');

describe('arrayToCSV', () => {
  it('converts an array to a csv string', () => {
    const rows = [
      ['foo', 'bar', 'baz'],
      ['foo2', 'bar2', 'baz2'],
    ];
    const results = arrayToCSV(rows);
    expect(typeof results).to.equal('string');
    const expected = 'foo,bar,baz\nfoo2,bar2,baz2';
    expect(results).to.equal(expected);
  });
});
