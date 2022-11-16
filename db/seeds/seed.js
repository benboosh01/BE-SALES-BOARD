const format = require('pg-format');
const db = require('../connection');

const seed = async ({ salesTypeData, userData, salesData }) => {
  await db.query(`DROP TABLE IF EXISTS sales;`);
  await db.query(`DROP TABLE IF EXISTS sales_types;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  const salesTypeTablePromise = db.query(`CREATE TABLE sales_types (
    sales_type VARCHAR PRIMARY KEY
   );`);

  const usersTablePromise = db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    level INT NOT NULL,
    team VARCHAR NOT NULL
   );`);

  await Promise.all([salesTypeTablePromise, usersTablePromise]);

  const salesTablePromise = db.query(`CREATE TABLE sales (
    sales_entry_id SERIAL PRIMARY KEY,
    sales_date INT NOT NULL,
    sales_user VARCHAR NOT NULL REFERENCES users(username),
    sales_number INT NOT NULL,
    sales_type VARCHAR NOT NULL REFERENCES sales_types(sales_type)
  );`);

  const insertSalesTypeQueryStr = format(
    `INSERT INTO sales_types (sales_type) VALUES %L RETURNING *;`,
    salesTypeData.map(({ sales_type }) => [sales_type])
  );

  const salesTypePromise = db
    .query(insertSalesTypeQueryStr)
    .then((result) => result.rows);

  const insertUsersQueryStr = format(
    `INSERT INTO users (username, first_name, surname, level, team) VALUES %L RETURNING *;`,
    userData.map(({ username, first_name, surname, level, team }) => [
      username,
      first_name,
      surname,
      level,
      team,
    ])
  );

  const usersPromise = db
    .query(insertUsersQueryStr)
    .then((result) => result.rows);

  await Promise.all([salesTablePromise, salesTypePromise, usersPromise]);

  const insertSalesQueryStr = format(
    `INSERT INTO sales (sales_date, sales_user, sales_number, sales_type) VALUES %L RETURNING *;`,
    salesData.map(({ sales_date, sales_user, sales_number, sales_type }) => [
      sales_date,
      sales_user,
      sales_number,
      sales_type,
    ])
  );

  const salesPromise = db
    .query(insertSalesQueryStr)
    .then((result) => result.rows);

  await salesPromise;
};

module.exports = seed;
