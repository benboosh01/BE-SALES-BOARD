const format = require('pg-format');
const db = require('./db/connection');

exports.checkExists = (table, column, value) => {
  const queryStr = format(`SELECT * FROM %I WHERE %I = $1`, table, column);
  const queryVal = [value];
  return db.query(queryStr, queryVal).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `${column} ${value} not found`,
      });
    } else {
      return [];
    }
  });
};
