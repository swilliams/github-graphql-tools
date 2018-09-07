require('dotenv').config();
const { runRecipe } = require('./recipeRunner');

const validateArgs = () => {
  if (process.argv.length < 3) {
    return new Error('Missing recipeName from args.');
  }
  return process.argv[2];
};
const recipeName = validateArgs();
if (recipeName instanceof Error) {
  /* eslint-disable no-console */
  console.error(recipeName);
  /* eslint-enable */
} else {
  runRecipe(recipeName);
}
