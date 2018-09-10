const Hoek = require('hoek');
const { expect, fail } = require('code');
const { it, describe } = exports.lab = require('lab').script();
const issueListReport = require('../../lib/transforms/issueListReport');

const validData = require('../fixtures/issues.json');
const options = {
  projectName: 'Launch Board',
  labelName: 'Critical',
};

const fixtureDataLength = validData.data.repository.issues.edges.length;

describe('issueListReport', () => {
  it('requires options to include a projectName and labelName', () => {
    const throws = () => {
      issueListReport(validData, {});
    };
    expect(throws).to.throw('Expected options to have projectName and labelName');
  });

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

  it('filters out issues not in the project', () => {
    const data = Hoek.clone(validData);
    const projectNodePath = 'data.repository.issues.edges.0.node.projectCards.edges.0.node.project';
    const projectNode = Hoek.reach(data, projectNodePath);
    if (projectNode === undefined) {
      fail('Did not get proper projectNode');
      return;
    }
    projectNode.name = 'test';
    const results = issueListReport(data, options);
    expect(results.length).to.equal(fixtureDataLength - 1);
  });

  it('filters out issues missing the required label', () => {
    const data = Hoek.clone(validData);
    const labelNodePath = 'data.repository.issues.edges.0.node.labels.edges.0.node';
    const labelNode = Hoek.reach(data, labelNodePath);
    if (labelNode === undefined) {
      fail('Did not get proper projectNode');
      return;
    }
    labelNode.name = 'test';
    const results = issueListReport(data, options);
    expect(results.length).to.equal(fixtureDataLength - 1);
  });
});
