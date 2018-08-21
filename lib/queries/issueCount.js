module.exports = (options = {}) => {
  const query = `
    query {
      repository(owner: "${options.owner}", name:"${options.name}") {
        issues(states:OPEN) {
          totalCount
        }
      }
    }
  `;
  return query;
};
