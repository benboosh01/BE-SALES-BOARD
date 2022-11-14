const models = require('../models/score-board.models');

exports.getSalesTypes = (req, res, next) => {
  models
    .selectSalesTypes()
    .then((salesTypes) => {
      res.status(200).send({ salesTypes });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUsers = (req, res, next) => {
  models
    .selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getSales = (req, res, next) => {
  const { sales_user, sales_type } = req.query;
  models
    .selectSales(sales_user, sales_type)
    .then((sales) => {
      res.status(200).send({ sales });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postUser = (req, res, next) => {
  const newUser = req.body;
  models
    .insertUser(newUser)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchSales = (req, res, next) => {
  const salesUpdate = req.body;
  models
    .updateSales(salesUpdate)
    .then((salesEntry) => {
      res.status(200).send({ salesEntry });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postSales = (req, res, next) => {
  const salesEntry = req.body;
  models
    .insertSales(salesEntry)
    .then((salesEntry) => {
      console.log(salesEntry);
      res.status(201).send({ salesEntry });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getApi = (req, res, next) => {
  const endpoints = models.returnEndpoints();
  res.status(200).send(endpoints);
};
