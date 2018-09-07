const path = require('path');
const fs = require('fs');
const axios = require('axios');
const inquirer = require('inquirer');
const formatVariable = require('./variableFormatter');

const loadRecipeFromFile = (recipeName) => {
  // check recipe path
  const pathToRecipe = path.resolve(__dirname, `./recipes/${recipeName}.json`);
  if (!fs.existsSync(pathToRecipe)) {
    return new Error(`Could not find a recipe named ${recipeName}`);
  }
  const rawRecipeText = fs.readFileSync(pathToRecipe, 'utf8');
  return JSON.parse(rawRecipeText);
};

const promptForVariables = async (recipe) => {
  if (!recipe.variables) return null;
  const questions = recipe.variables.map((varName) => {
    return {
      type: 'input',
      name: varName,
      message: `Enter value for '${formatVariable(varName)}'`,
    };
  });
  const answers = await inquirer.prompt(questions);
  return answers;
};

// variables is an object with the return value from an inquirer response
// ex:
// { 
//   VARNAME: 'some value'
// }
const applyVariablesInOptions = (variables, options) => {
  const mappedOptions = {};
  Object.keys(options).forEach((key) => {
    // check value for key for variable
    let val = options[key];
    Object.keys(variables).foreach((varName) => {
      val = val.replace(varName, variables[varName]);
    });
    mappedOptions[key] = val;
  });
  return mappedOptions;
};

const runRecipe = async (recipeName) => {
  if (!recipeName) {
    throw new Error('Empty string for recipeName.');
  }
  const accessToken = process.env.GITHUB_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Did not load GitHub accessToken from ENV.');
  }
  const recipe = loadRecipeFromFile(recipeName);
  if (recipe instanceof (Error)) {
    throw recipe;
  }
  const url = 'https://api.github.com/graphql';

  try {
    // query
    const { name, options } = recipe.queries[0];
    // TODO:
    // Evaluate options for variables and replace them as appropriate

    const query = require(`./queries/${name}`)(options);
    const stringified = JSON.stringify({ query });
    const config = { 
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios.post(url, stringified, config);

    // transform
    const data = res.data;
    const transformedData = recipe.transforms.reduce((acc, transform) => {
      const tx = require(`./transforms/${transform.name}`);
      return tx(acc, transform.options);
    }, data);

    // export
    recipe.exporters.forEach((exporter) => {
      const fx = require(`./exports/${exporter.name}`);
      fx(transformedData, exporter.options);
    });

    // console.log('done', results);
  } catch (ex) {
    /* eslint-disable no-console */
    console.log('Error performing transform', ex);
    /* eslint-enable */
  }
};

module.exports = {
  runRecipe,
  promptForVariables,
};
