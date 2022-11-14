const express = require('express');
const controllers = require('./controllers/score-board.controllers');
const errorHandlers = require('./controllers/error-handling.controllers');

const app = express();

app.use(express.json());

app.get('/', controllers.getApi);
app.get('/api', controllers.getApi);
app.get('/api/sales_types', controllers.getSalesTypes);
app.get('/api/users', controllers.getUsers);
app.get('/api/sales', controllers.getSales);
app.post('/api/users', controllers.postUser);
app.patch('/api/sales', controllers.patchSales);
app.post('/api/sales', controllers.postSales);

app.use(errorHandlers.customError);
app.use(errorHandlers.psqlErrors);
app.use(errorHandlers.serverError);

module.exports = app;
