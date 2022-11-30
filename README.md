SALES BOARD APP

A back end API for accessing live sales information for remote working sales teams

HOSTED VERSION

https://sales-board.cyclic.app

SETUP --->>>

> > > SYSTEM REQUIREMENTS

Node v18.6.0

PostgreSQL v14.4

> > > CLONE

git clone https://github.com/benboosh01/BE-SALES-BOARD.git

> > > ENV FILES

create the following files in the root folder of the app:

.env.test --> add: PGDATABASE=score_board

.env.development. --> add: PGDATABASE=score_board_test

Ensure that these .env files are .gitignored.

> > > DEPENDENCIES

The project relies on the following dependancies, to install these type npm install in the terminal

dependencies:

cors: 2.8.5
dotenv: 16.0.3
express: 4.18.2
pg: 8.8.0
pg-format: 1.0.4
postgres: 3.3.1

development dependencies for testing:
jest: 29.3.1
supertest: 6.3.1

> > > SETUP LOCAL DATABASE

npm run setup-dbs

> > > SEED LOCAL DATBASE

npm run seed

> > > > TEST

npm test
