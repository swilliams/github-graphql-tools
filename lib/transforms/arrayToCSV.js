module.exports = (rows) => {
  return rows.map((row) => row.join(',')).join('\n');
};
