const Hoek = require('hoek');
const Joi = require('joi');

const filterIssueForProjectName = (issue, projectName) => {
  const cards = Hoek.reach(issue, 'node.projectCards.edges') || [];
  return cards.find((card) => card.node.project.name === projectName) !== undefined;
};

const filterIssueForLabelName = (issue, labelName) => {
  const labels = Hoek.reach(issue, 'node.labels.edges') || [];
  return labels.find((label) => label.node.name === labelName) !== undefined;
};

module.exports = (data, options = {}) => {
  const optionsSchema = Joi.object().keys({
    projectName: Joi.string().required(),
    labelName: Joi.string().required(),
  });
  Hoek.assert(
    Joi.validate(options, optionsSchema).error === null, 
    new Error('Expected options to have projectName and labelName.')
  );

  const { projectName, labelName } = options;
  const issues = data.data.repository.issues.edges;
  const rows = issues
    .filter((issue) => filterIssueForProjectName(issue, projectName))
    .filter((issue) => filterIssueForLabelName(issue, labelName))
    .map((issue) => {
      const labels = Hoek.reach(issue, 'node.labels.edges') ? 
        issue.node.labels.edges.map((lbl) => lbl.node.name).join(', ') : 
        null;
      return {
        number: issue.node.number,
        title: issue.node.title,
        url: issue.node.url,
        labels,
      };
    });
  return rows;
};
