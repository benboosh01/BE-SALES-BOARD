const testData = require('../data/test-data/index.js');
const devData = require('../data/development-data/index.js');
const seed = require('./seed');
const db = require('../connection');

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
