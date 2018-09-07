const { expect } = require('code');
const { it, describe } = exports.lab = require('lab').script();
const issueListReport = require('../../lib/transforms/issueListReport');

const validData = require('../fixtures/issues.json');
const options = {
  projectName: 'Launch Board',
  labelName: 'Critical',
};

const fixtureDataLength = validData.data.repository.issues.edges.length;

describe('issueListReport', () => {
  it('retrieves the issue title', () => {
    const results = issueListReport(validData, options);
    const issuesWithTitles = results.filter((iss) => iss.title && iss.title !== '');
    expect(issuesWithTitles.length).to.equal(fixtureDataLength);
  });

  it('retrieves the issue url', () => {
    const results = issueListReport(validData, options);
    const issuesWithURLs = results.filter((iss) => iss.url && iss.url !== '');
    expect(issuesWithURLs.length).to.equal(fixtureDataLength);
  });

  it('retrieves the issue number', () => {
    const results = issueListReport(validData, options);
    const issuesWithNumbers = results.filter((iss) => iss.number);
    expect(issuesWithNumbers.length).to.equal(fixtureDataLength);
  });

  it('retrieves a list of labels as a string', () => {
    const results = issueListReport(validData, options);
    const issuesWithLabels = results.filter((iss) => iss.labels && iss.labels !== '');
    expect(issuesWithLabels.length).to.equal(fixtureDataLength);
  });

  it('creates an array with the same number of issues as the input', () => {
    const results = issueListReport(validData, options);
    expect(results.length).to.equal(fixtureDataLength);
  });
});
