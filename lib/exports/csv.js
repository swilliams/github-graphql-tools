const fs = require('fs');

module.exports = (csvString, options) => {
  fs.writeFile(options.path, csvString, (err) => {
    if (err) {
      /* eslint-disable no-console */
      console.log(`Error writing to '${options.path}'`, err);
      /* eslint-enable */
    }
  });
};
