const { expect } = require('code');
const { it, describe } = exports.lab = require('lab').script();
const issueListWithLabel = require('../../lib/queries/issueListWithLabel');

describe('issueListWithLabel', () => {
  it('requires owner, name, and label in options', () => {
    const throws = () => {
      issueListWithLabel({});
    };
    expect(throws).to.throw(Error, 'Expected options to have owner, name, and label.');
  });

  it('maps owner, name, and label in the query', () => {
    const options = {
      name: 'Test Name',
      label: 'Test Label',
      owner: 'Test Owner',
    };
    const result = issueListWithLabel(options);
    expect(result).to.not.be.null();
    expect(result.indexOf('Test Name')).to.be.greaterThan(0);
    expect(result.indexOf('Test Label')).to.be.greaterThan(0);
    expect(result.indexOf('Test Owner')).to.be.greaterThan(0);
  });
});
