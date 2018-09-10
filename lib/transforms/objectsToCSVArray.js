// removes quotes and commas that'll screw up a csv's formatting.
const escapeField = (str) => {
  const escapedQuotes = ('' + str).replace(/"/g, '\'');
  const escapedComma = `"${escapedQuotes}"`;
  return escapedComma;
};

const mapper = (object, columnOrder) => {
  return columnOrder.map((key) => escapeField(object[key] || ''));
};

module.exports = (listOfObjects, options) => {
  const results = listOfObjects.map((obj) => mapper(obj, options.columnOrder));
  return results;
};
