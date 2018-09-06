const Hoek = require('hoek');

module.exports = (data, options = {}) => {
  const { projectName, labelName } = options;
  const issues = data.data.repository.issues.edges;
  const rows = issues
    .filter((issue) => {
      const cards = Hoek.reach(issue, 'node.projectCards.edges');
      if (cards === undefined || cards.length === 0) { 
        return false; 
      }
      return cards.find((card) => card.node.project.name === projectName) !== undefined;
    })
    .filter((issue) => {
      const labels = Hoek.reach(issue, 'node.labels.edges');
      if (labels === undefined || labels.length === 0) { 
        return false; 
      }
      return labels.find((label) => label.node.name === labelName) !== undefined;
    })
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
