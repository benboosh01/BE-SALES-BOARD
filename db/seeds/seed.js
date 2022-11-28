const format = require('pg-format');
const db = require('../connection');

const seed = async ({
  organisationsData,
  salesTypeData,
  userData,
  salesData,
}) => {
  await db.query(`DROP TABLE IF EXISTS sales;`);
  await db.query(`DROP TABLE IF EXISTS sales_types;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS organisations;`);

  const salesTypeTablePromise = db.query(`CREATE TABLE sales_types (
    sales_type VARCHAR PRIMARY KEY
   );`);

  const organisationsTablePromise = db.query(`CREATE TABLE organisations (
    organisation_name VARCHAR PRIMARY KEY,
    organisation_password VARCHAR
    );`);

  await Promise.all([salesTypeTablePromise, organisationsTablePromise]);

  const usersTablePromise = db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    level INT NOT NULL,
    team VARCHAR NOT NULL,
    organisation VARCHAR NOT NULL REFERENCES organisations(organisation_name)
   );`);

  await usersTablePromise;

  const salesTablePromise = db.query(`CREATE TABLE sales (
    sales_entry_id SERIAL PRIMARY KEY,
    sales_date VARCHAR NOT NULL,
    sales_user VARCHAR NOT NULL REFERENCES users(username),
    sales_number INT NOT NULL,
    sales_type VARCHAR NOT NULL REFERENCES sales_types(sales_type)
  );`);

  await salesTablePromise;

  const insertSalesTypeQueryStr = format(
    `INSERT INTO sales_types (sales_type) VALUES %L RETURNING *;`,
    salesTypeData.map(({ sales_type }) => [sales_type])
  );

  const salesTypePromise = db
    .query(insertSalesTypeQueryStr)
    .then((result) => result.rows);

  const organisationsQuerySt = format(
    `INSERT INTO organisations (organisation_name, organisation_password) VALUES %L RETURNING *;`,
    organisationsData.map(({ organisation_name, organisation_password }) => [
      organisation_name,
      organisation_password,
    ])
  );

  const organisationsPromise = db
    .query(organisationsQuerySt)
    .then((result) => result.rows);

  await Promise.all([salesTypePromise, organisationsPromise]);

  const insertUsersQueryStr = format(
    `INSERT INTO users (username, first_name, surname, level, team, organisation) VALUES %L RETURNING *;`,
    userData.map(
      ({ username, first_name, surname, level, team, organisation }) => [
        username,
        first_name,
        surname,
        level,
        team,
        organisation,
      ]
    )
  );

  const usersPromise = db
    .query(insertUsersQueryStr)
    .then((result) => result.rows);

  await usersPromise;

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
