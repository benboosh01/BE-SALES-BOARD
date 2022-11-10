const testData = require('../data/test-data/index.js');
const seed = require('./seed');
const db = require('../connection');

const runSeed = () => {
  return seed(testData).then(() => db.end());
};

runSeed();
