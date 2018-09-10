const Hoek = require('hoek');
const Joi = require('joi');

module.exports = (options = {}) => {
  const optionsSchema = Joi.object().keys({
    owner: Joi.string().required(),
    name: Joi.string().required(),
    label: Joi.string().required(),
  });
  Hoek.assert(
    Joi.validate(options, optionsSchema).error === null, 
    new Error('Expected options to have owner, name, and label.')
  );

  const query = `
  query { 
    repository(owner:"${options.owner}", name:"${options.name}") {
      issues(last:100, states:OPEN, labels:["${options.label}"]) {
        edges {
          node {
            title
            url
            number
            assignees(last: 100) {
              edges {
                node {
                  name,
                  login
                }
              }
            }
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
