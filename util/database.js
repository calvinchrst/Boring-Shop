const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const fs = require("fs");

let _db;

const mongoConnect = callback => {
  configPath = "./db_config.json";
  config = JSON.parse(fs.readFileSync(configPath, "UTF-8"));
  mongodbConnectionURL =
    config.databaseUrlPrefix +
    config.username +
    ":" +
    config.password +
    config.databaseUrlPostfix;

  MongoClient.connect(mongodbConnectionURL)
    .then(client => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
