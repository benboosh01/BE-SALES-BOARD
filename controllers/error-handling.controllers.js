exports.customError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'invalid input' });
  } else if (err.code === '23503') {
    if (
      err.detail.includes('sales_user') &&
      err.detail.includes('not present in table "users"')
    ) {
      res.status(404).send({ msg: `username not found` });
    }
  } else {
    next(err);
  }
};

exports.serverError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
};
