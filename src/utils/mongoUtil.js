import { MongoClient } from "mongodb";
import config from "../config";

let _db;

module.exports = {
  connectToServer: function(callback) {
    MongoClient.connect(config.database.url)
      .then(client => {
        _db = client.db("latch-admin");
        return callback();
      })
      .catch(err => console.log(err));
  },
  getDb: function() {
    return _db;
  }
};
