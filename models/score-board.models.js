const db = require('../db/connection');
const { checkExists } = require('../utils');

exports.selectSalesTypes = async () => {
  const result = await db.query(`SELECT * FROM sales_types;`);
  return result.rows;
};

exports.selectUsers = async () => {
  const result = await db.query(`SELECT * FROM users`);
  return result.rows;
};

exports.selectSales = async (sales_user, sales_type) => {
  let queryStr = `SELECT * FROM sales`;
  const queryVals = [];

  if (sales_user && sales_type) {
    queryStr += ` WHERE sales_user = $1 AND sales_type = $2`;
    queryVals.push(sales_user, sales_type);
  } else if (sales_user) {
    queryStr += ` WHERE sales_user = $1`;
    queryVals.push(sales_user);
  } else if (sales_type) {
    queryStr += ` WHERE sales_type = $1`;
    queryVals.push(sales_type);
  }

  queryStr += ` ORDER BY sales_date ASC;`;

  const result = await db.query(queryStr, queryVals);
  return result.rows;
};

exports.insertUser = async (newUser) => {
  const { username, first_name, surname, level } = newUser;
  if (!username || !first_name || !surname || !level) {
    return Promise.reject({
      status: 400,
      msg: 'missing user details - all fields must be completed',
    });
  }

  const queryStr = `INSERT INTO users (username, first_name, surname, level) VALUES ($1, $2, $3, $4) RETURNING *;`;
  const queryVals = [username, first_name, surname, level];
  const result = await db.query(queryStr, queryVals);
  return result.rows[0];
};

exports.updateSales = async (salesUpdate) => {
  const { sales_user, sales_date, sales_type, inc_sales } = salesUpdate;
  if (!sales_user || !sales_date || !sales_type || !inc_sales) {
    return Promise.reject({
      status: 400,
      msg: 'missing sales details - all fields must be completed',
    });
  }

  const queryStr = `UPDATE sales SET sales_number = sales_number + $1 WHERE sales_user = $2 AND sales_date = $3 AND sales_type = $4 RETURNING *;`;
  const queryVals = [inc_sales, sales_user, sales_date, sales_type];
  const result = await db.query(queryStr, queryVals);

  if (result.rows.length === 0) {
    const salesDateCheck = await checkExists('sales', 'sales_date', sales_date);
    const userCheck = await checkExists('users', 'username', sales_user);
    const salesTypeCheck = await checkExists(
      'sales_types',
      'sales_type',
      sales_type
    );
    if (salesDateCheck.length === 0) {
      return userCheck;
    } else if (salesDateCheck.length === 0) {
      return salesDateCheck;
    } else {
      return salesTypeCheck;
    }
  } else {
    return result.rows[0];
  }
};

exports.insertSales = async (salesEntry) => {
  const { sales_date, sales_user, sales_number, sales_type } = salesEntry;
  if (!sales_user || !sales_date || !sales_type || !sales_number) {
    return Promise.reject({
      status: 400,
      msg: 'missing sales details - all fields must be completed',
    });
  }

  const queryStr = `INSERT INTO sales (sales_date, sales_user, sales_number, sales_type) VALUES ($1, $2, $3, $4) RETURNING *;`;
  const queryVals = [sales_date, sales_user, sales_number, sales_type];
  const result = await db.query(queryStr, queryVals);

  return result.rows[0];
};

exports.returnEndpoints = () => {
  return endpoints;
};
