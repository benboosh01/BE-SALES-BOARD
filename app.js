const express = require('express');
const cors = require('cors');
const controllers = require('./controllers/score-board.controllers');
const errorHandlers = require('./controllers/error-handling.controllers');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', controllers.getApi);
app.get('/api', controllers.getApi);
app.get('/api/sales_types', controllers.getSalesTypes);
app.get('/api/users', controllers.getUsers);
app.get('/api/sales', controllers.getSales);
app.post('/api/users', controllers.postUser);
app.post('/api/sales', controllers.postSales);
app.patch('/api/sales', controllers.patchSales);
app.patch('/api/users', controllers.patchUser);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'invalid URL' });
});

app.use(errorHandlers.customError);
app.use(errorHandlers.psqlErrors);
app.use(errorHandlers.serverError);

module.exports = app;
