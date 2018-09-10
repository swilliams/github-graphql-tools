const changeCase = require('change-case');

const formatVariable = (varName) => {
  return changeCase.camelCase(varName);
};

module.exports = formatVariable;
