const { expect } = require('code');
const { it, describe } = exports.lab = require('lab').script();
const objectsToCSVArray = require('../../lib/transforms/objectsToCSVArray');

describe('objectsToCSVArray', () => {
  it('turns an object into an array of strings based on columnOrder', () => {
    const obj = {
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
    };
    const results = objectsToCSVArray([obj], { columnOrder: ['bar', 'foo', 'baz'] });
    expect(results).to.equal([['"bar"', '"foo"', '"baz"']]);
  });

  it('puts an empty string in when a column is not found', () => {
    const obj = {
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
    };
    const results = objectsToCSVArray([obj], { columnOrder: ['bar', 'derp', 'baz'] });
    expect(results).to.equal([['"bar"', '""', '"baz"']]);
  });
});
