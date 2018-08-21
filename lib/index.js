const axios = require('axios');
require('dotenv').config();



const main = async () => {
  const accessToken = process.env.GITHUB_ACCESS_TOKEN;
  const url = 'https://api.github.com/graphql';

  try {
    // query
    const { name, options } = recipe.queries[0];
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
      return transform.tx(acc, transform.options);
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

main();
