module.exports = (rows, options) => {
  const { fieldName } = options;
  const fn = (row) => {
    const canMapField = row[fieldName] && Array.isArray(row[fieldName]);
    if (canMapField) {
      row[fieldName] = row[fieldName].join(', ');
    }
    return row;
  };
  return rows.map(fn);
};
