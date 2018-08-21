module.exports = (options = {}) => {
  const query = `
  query { 
    repository(owner:"${options.owner}", name:"${options.name}") {
      issues(last:100, states:OPEN, labels:["${options.label}"]) {
        edges {
          node {
            title
            url
            number
            projectCards(first:5) {
              edges {
                node {
                  project {
                    name
                  }
                }
              }
            }
            labels(first:10) {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
  `;
  return query;
};
