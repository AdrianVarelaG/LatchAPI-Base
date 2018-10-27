/*export default {
  database: {
    url:
      "mongodb+srv://" +
      process.env.MONGO_ATLAS_USER +
      ":" +
      process.env.MONGO_ATLAS_PASSWORD +
      "@kster-cluster01-bkebd.mongodb.net/test?retryWrites=true"
  }
};*/

const URLbase = "mongodb://localhost:27017/";

export default {
  database: {
    url: URLbase + "?retryWrites=true",
    urlIndex: URLbase
  }
};
