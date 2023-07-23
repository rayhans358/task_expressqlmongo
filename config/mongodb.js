const{ MongoClient } = require('mongodb');

const url = 'mongodb://najib:67890@0.0.0.0:27017?authSource=admin';
const client = new MongoClient(url);

(async () => {
  try {
    await client.connect();
    console.log('Connected successfully');
  } catch (err) {
    console.log(err);
  }
})();

const db = client.db('task-mongo');

module.exports = db;